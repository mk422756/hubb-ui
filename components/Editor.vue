<template>
  <div class="main">
    <no-ssr>
      <div class="editor">
        <editor-floating-menu
          v-slot="{ commands, isActive, menu }"
          :editor="editor"
        >
          <div
            class="editor__floating-menu"
            :class="{ 'is-active': menu.isActive }"
            :style="`top: ${menu.top}px`"
          >
            <div class="buttons has-addons">
              <button
                class="menubar__button button is-small is-outlined"
                :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })"
              >
                <font-awesome-icon icon="heading" />
                <strong>1</strong>
              </button>
              <button
                class="menubar__button button is-small is-outlined"
                :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })"
              >
                <font-awesome-icon icon="heading" />
                <strong>2</strong>
              </button>
              <button
                class="menubar__button button is-small is-outlined"
                :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                @click="commands.heading({ level: 3 })"
              >
                <font-awesome-icon icon="heading" />
                <strong>3</strong>
              </button>
              <button
                class="menubar__button button is-small is-outlined"
                :class="{ 'is-active': isActive.bold() }"
                @click="commands.bold"
              >
                <font-awesome-icon icon="bold" />
              </button>
              <button
                class="menubar__button button is-small is-outlined"
                :class="{ 'is-active': isActive.blockquote() }"
                @click="commands.blockquote"
              >
                <font-awesome-icon icon="quote-right" />
              </button>
              <button
                class="menubar__button button is-small is-outlined"
                :class="{ 'is-active': isActive.code_block() }"
                @click="commands.code_block"
              >
                <font-awesome-icon icon="code" />
              </button>
              <button
                class="menubar__button button is-small is-outlined"
                @click="openModal(commands.image)"
              >
                <font-awesome-icon icon="image" />
              </button>
            </div>
          </div>
        </editor-floating-menu>
        <editor-content :editor="editor" />
      </div>
      <image-modal ref="ytmodal" @onConfirm="addCommand" />
    </no-ssr>
  </div>
</template>

<script>
import ImageModal from '~/components/ImageModal.vue'
import javascript from 'highlight.js/lib/languages/javascript'
import go from 'highlight.js/lib/languages/go'
import css from 'highlight.js/lib/languages/css'
import { Editor, EditorContent, EditorFloatingMenu } from 'tiptap'
import {
  Heading,
  Bold,
  CodeBlock,
  HardBreak,
  Blockquote,
  History,
  CodeBlockHighlight,
  Image
} from 'tiptap-extensions'

export default {
  components: {
    ImageModal,
    EditorFloatingMenu,
    EditorContent
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this.text,
      extensions: [
        // The editor will accept paragraphs and headline elements as part of its document schema.
        new Heading({ levels: [1, 2, 3] }),
        new Bold(),
        new CodeBlock(),
        new HardBreak(),
        new Blockquote(),
        new History(),
        new Image(),
        new CodeBlockHighlight({
          languages: {
            javascript,
            go,
            css
          }
        })
      ],
      onUpdate: ({ getHTML }) => {
        this.$emit('update-text', getHTML())
      }
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    openModal(command) {
      this.$refs.ytmodal.showModal(command)
    },
    addCommand(data) {
      if (data.command !== null) {
        data.command(data.data)
      }
    }
  }
}
</script>
<style scoped>
.editor {
  position: relative;
}

.editor__floating-menu {
  position: absolute;
  z-index: 1;
  margin-top: -1.6rem;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
}
.editor /deep/ .ProseMirror {
  text-align: left;
  background-color: rgb(255, 255, 255);
  border: 2px solid rgb(221, 221, 221);
  border-radius: 5px;
  padding: 1.5rem;
}

.editor__floating-menu.is-active {
  opacity: 1;
  visibility: visible;
}

.editor >>> h1 {
  font-size: 1.8rem;
}

.editor >>> h2 {
  font-size: 1.6rem;
}

.editor >>> h3 {
  font-size: 1.3rem;
}

.editor >>> blockquote {
  position: relative;
  padding: 20px 15px 8px 15px;
  box-sizing: border-box;
  font-style: italic;
  background: #efefef;
  color: #555;
}

.editor >>> blockquote:before {
  display: inline-block;
  position: absolute;
  top: 5px;
  left: 3px;
  content: '“';
  font-family: sans-serif;
  color: #cfcfcf;
  font-size: 50px;
  line-height: 1;
}

.editor >>> blockquote p {
  padding: 0;
  margin: 10px 0;
  line-height: 1.7;
}

.editor >>> blockquote cite {
  display: block;
  text-align: right;
  color: #888888;
  font-size: 0.9em;
}
</style>
