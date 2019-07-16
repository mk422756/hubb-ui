<template>
  <div class="main">
    <div class="profile-settings box">
      <div>
        <h2 class="has-text-weight-semibold is-size-5">ページ画像</h2>
        <div class="has-text-centered">
          <crop ref="crop" />
        </div>
      </div>
      <div class="field">
        <label class="label">ページ名</label>
        <div class="control">
          <input v-model.trim="name" class="input" type="text" />
        </div>
      </div>

      <div class="field">
        <label class="label">本文</label>
        <div class="control editor">
          <!-- <textarea v-model="text" class="textarea" /> -->
          <editor :text="text" @update-text="updateText" />
        </div>
      </div>
      <div class="has-text-centered create-button">
        <button
          class="button is-primary"
          :disabled="!canSubmit"
          @click="submit"
        >
          作成
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import Crop from '~/components/ImageCrop.vue'
import Editor from '~/components/Editor.vue'
import { storage } from '~/plugins/firebase'
import { User } from '../../..'

@Component({
  components: {
    Editor,
    Crop
  }
})
export default class extends Vue {
  name = ''
  text = ''

  get user(): User {
    return this.$store.state.user.user
  }

  get canSubmit(): boolean {
    return !!this.name
  }

  async submit() {
    try {
      const res = await (this as any).$apollo.mutate({
        mutation: gql`
          mutation($name: String!, $text: String!, $userId: ID!) {
            createPage(input: { text: $text, name: $name, userId: $userId }) {
              id
            }
          }
        `,
        variables: {
          name: this.name,
          text: this.text,
          userId: this.$store.state.user.user.id
        }
      })
      await this.saveImage(res.data.createPage.id)
      this.$router.push(`/pages/${res.data.createPage.id}`)
      this.$toast.success('保存しました')
    } catch (e) {
      console.log(e)
      this.$toast.error('保存に失敗しました')
    }
  }

  async saveImage(pageId: string) {
    const data = (this as any).$refs.crop.getData()
    if (!data) {
      return
    }
    const storageRef = storage.ref()
    const imagesRef = storageRef.child(
      `user/${this.user.uid}/page/${pageId}/main`
    )
    const snapshot = await imagesRef.putString(data, 'data_url')
    const downloadURL = await snapshot.ref.getDownloadURL()
    await this.submitImage(pageId, downloadURL)
  }

  async submitImage(pageId: string, image: string) {
    await (this as any).$apollo.mutate({
      mutation: gql`
        mutation($id: ID!, $image: String!) {
          updatePage(id: $id, input: { image: $image }) {
            id
            image
          }
        }
      `,
      // Parameters
      variables: {
        id: pageId,
        image: image
      }
    })
  }

  updateText(text: string) {
    this.text = text
  }
}
</script>
<style>
.box {
  margin: 0 auto;
  max-width: 800px;
}

.create-button {
  margin-top: 50px;
}
</style>
