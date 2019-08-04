<template>
  <div>
    <div>
      <h1 class="title">{{ name }}</h1>
    </div>
    <div class="main">
      <div
        class="text"
        v-html="
          $sanitize(text, {
            allowedTags: [
              'img',
              'iframe',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'blockquote',
              'p',
              'a',
              'ul',
              'ol',
              'nl',
              'li',
              'b',
              'i',
              'strong',
              'em',
              'strike',
              'code',
              'hr',
              'br',
              'div',
              'table',
              'thead',
              'caption',
              'tbody',
              'tr',
              'th',
              'td',
              'pre'
            ],
            allowedAttributes: {
              a: ['href'],
              img: ['src'],
              iframe: ['src']
            },
            allowedIframeHostnames: ['www.youtube.com']
          })
        "
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import dayjs from 'dayjs'
import hljs from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import go from 'highlight.js/lib/languages/go'
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('go', go)
import 'highlight.js/styles/github.css'

@Component({})
export default class extends Vue {
  @Prop({ default: '' }) readonly name!: string
  @Prop({ default: '' }) readonly text!: string
  @Prop({ default: '' }) readonly createdAt!: string

  mounted() {
    hljs.initHighlighting()
  }

  get formattedCreatedAt() {
    return this.createdAt === ''
      ? ''
      : dayjs(this.createdAt).format('YYYY/MM/DD HH:mm:ss')
  }
}
</script>
<style scoped>
.main {
  margin-top: 50px;
  color: #333;
}

.title {
  font-size: 40px;
}

.text {
  line-height: 1.9;
  font-size: 16px;
}
</style>
