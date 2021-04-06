<template>
  <ckeditor :editor="editor" :config="editorConfig" :value="value" @input="setValue" />
</template>

<script>
  import ClassicEditor from '../../ckeditor/build/ckeditor';

  // console.log(ClassicEditor.builtinPlugins.map(plugin => plugin.pluginName));

  export default {
    name: 'CKEditor',
    props: {
      value: {
        type: String,
      },
    },
    data: () => ({
      editor: ClassicEditor,
      editorConfig: {
        contentsLangDirection: 'ltr',
        contentsCss: 'body {font-family: "arial", "tahoma"}',
        language: 'en',
        table: {
          contentToolbar: ['TableCellProperties', 'TableProperties'],
        },
        image: {
          toolbar: ['ImageResize'],
        },
        mediaEmbed: {
          toolbar: ['MediaEmbedToolbar'],
        },
        sampleUpload: {
          // change URL to your backend endpoint.
          uploadUrl: 'http://localhost:8000/upload',
          headers: {
            'X-CSRF-TOKEN': 'CSRF-Token',
            'Authorization': 'Bearer <JSON Web Token>',
          },
        },
        toolbar: [
          'heading',
          'FontFamily',
          'FontSize',
          'FontColor',
          'FontBackgroundColor',
          '|',
          'bold',
          'italic',
          'underline',
          'RemoveFormat',
          '|',
          'link',
          'blockQuote',
          'HorizontalLine',
          '|',
          'numberedList',
          'bulletedList',
          '|',
          'insertTable',
          '|',
          'Alignment',
          'outdent',
          'indent',
          '|',
          'Code',
          'CodeBlock',
          'HtmlEmbed',
          '|',
          'imageUpload',
          'mediaEmbed',
          '|',
          'undo',
          'redo',
        ],
      },
    }),
    methods: {
      setValue(e) {
        this.$emit('input', e);
      },
    },
  };
</script>

<style>
  .ck-content {
    min-height: 350px;
    max-height: 500px;
  }
</style>
