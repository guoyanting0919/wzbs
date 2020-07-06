<template>
  <div id="home">
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js";
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor.js";
import FontFamily from "@ckeditor/ckeditor5-font/src/fontfamily.js";
import FontSize from "@ckeditor/ckeditor5-font/src/fontsize.js";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import Image from "@ckeditor/ckeditor5-image/src/image.js";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption.js";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize.js";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle.js";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar.js";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload.js";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      editor: ClassicEditor,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          LinkPlugin,
          ParagraphPlugin,
          Alignment,
          Heading,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          MediaEmbed,
          List,
          Image,
          ImageResize,
          ImageUpload,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          CKFinder
        ],

        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "|",
            "fontBackgroundColor",
            "fontColor",
            "fontSize",
            "|",
            "link",
            "imageUpload",
            "mediaEmbed",
            "|",
            "alignment",
            "numberedList",
            "|",
            "undo",
            "redo"
          ]
        },
        image: {
          toolbar: [
            "imageTextAlternative",
            "|",
            "imageStyle:full",
            "imageStyle:side"
          ]
        },
        ckfinder: {
          uploadUrl: `/upload`,
          // 後端的上傳圖片 API 路徑
          options: {
            resourceType: "Images"
            // 限定類型為圖片
          }
        }
      }
    };
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {
    // console.log(process.env.VUE_APP_API);
  }
};
</script>
<style lang='scss'>
#home {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  // padding-bottom: 5rem;
}
</style>
