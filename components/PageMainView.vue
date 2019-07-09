<template>
  <div>
    <div>
      <h1 class="title">{{ name }}</h1>
    </div>
    <div class="main">
      <div
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

@Component({})
export default class extends Vue {
  @Prop({ default: '' }) readonly name!: string
  @Prop({ default: '' }) readonly text!: string
  @Prop({ default: '' }) readonly createdAt!: string

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
  line-height: 40px;
  font-size: 19px;
  color: #555;
}

.title {
  font-size: 40px;
}
</style>
