<template>
  <div class="main">
    <div class="profile-settings box">
      <div>
        <h2 class="has-text-weight-semibold is-size-5">ページ画像</h2>
        <div class="has-text-centered">
          <crop ref="crop" :image="image" />
        </div>
      </div>
      <div class="field">
        <label class="label">ページ名</label>
        <div class="control">
          <input v-model.trim="nameInput" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label">タグ(半角カンマ区切りで入力してください)</label>
        <div class="control">
          <input v-model.trim="tagTextInput" class="input" type="text" />
        </div>
        <div class="tags">
          <template v-for="(tag, i) in tags">
            <span v-if="tag" :key="i" class="tag is-info">{{ tag }}</span>
          </template>
        </div>
      </div>

      <div class="field">
        <label class="label">本文</label>
        <div class="control editor">
          <editor :text="textInput" @update-text="updateText" />
        </div>
      </div>
      <div class="has-text-centered create-button">
        <button
          class="button is-primary"
          :disabled="!canSubmit"
          @click="submit"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Prop } from 'vue-property-decorator'
import Crop from '~/components/ImageCrop.vue'
import Editor from '~/components/Editor.vue'
import { User } from '..'

export interface EditParam {
  name: string
  text: string
  tags: string[]
  image: string
}

@Component({
  components: {
    Editor,
    Crop
  }
})
export default class extends Vue {
  @Prop({ default: '' }) readonly name!: string
  @Prop({ default: '' }) readonly text!: string
  @Prop({ default: '' }) readonly image!: string
  @Prop({ default: '' }) readonly tag!: string

  nameInput = ''
  textInput = ''
  tagTextInput = ''

  created() {
    this.nameInput = this.name
    this.textInput = this.text
    this.tagTextInput = this.tag
  }

  get tags(): string[] {
    return this.tagTextInput.split(',')
  }

  get user(): User {
    return this.$store.state.user.user
  }

  get canSubmit(): boolean {
    return !!this.nameInput
  }

  async submit() {
    this.$emit('submit', {
      name: this.nameInput,
      text: this.textInput,
      tags: this.tags,
      image: (this as any).$refs.crop.getData()
    })
  }

  updateText(text: string) {
    this.textInput = text
  }
}
</script>
<style scoped>
.box {
  margin: 0 auto;
  max-width: 800px;
}

.create-button {
  margin-top: 50px;
}

.tags {
  margin-top: 10px;
}
</style>
