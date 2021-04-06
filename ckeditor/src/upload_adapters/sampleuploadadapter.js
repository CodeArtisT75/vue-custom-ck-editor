import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import { logWarning } from '@ckeditor/ckeditor5-utils/src/ckeditorerror';

export default class SampleUploadAdapter extends Plugin {
  static get requires() {
    return [FileRepository];
  }

  static get pluginName() {
    return 'SampleUploadAdapter';
  }

  init() {
    const options = this.editor.config.get('sampleUpload');

    if (!options) {
      return;
    }

    if (!options.uploadUrl) {
      logWarning('simple-upload-adapter-missing-uploadurl');

      return;
    }

    this.editor.plugins.get(FileRepository).createUploadAdapter = loader => {
      return new Adapter(loader, options);
    };
  }
}

class Adapter {
  constructor(loader, options) {
    this.loader = loader;
    this.options = options;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open('POST', this.options.uploadUrl, true);
    xhr.responseType = 'json';
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }
      resolve({
        default: response.url,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  _sendRequest(file) {
    const data = new FormData();

    data.append('upload', file);
    // add more fields

    if (this.options.headers && this.options.headers.Authorization)
      this.xhr.setRequestHeader('Authorization', this.options.headers.Authorization);

    // Send the request.
    this.xhr.send(data);
  }
}
