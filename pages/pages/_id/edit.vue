<template>
  <div v-if="isMyAccountId && page" class="main">
    <div class="profile-settings box">
      <div>
        <h2 class="has-text-weight-semibold is-size-5">ページ画像</h2>
        <div class="has-text-centered">
          <crop ref="crop" :image="page.image" />
          <button class="button is-primary" @click="saveImage">
            画像保存
          </button>
        </div>
      </div>
      <div class="field">
        <label class="label">ページ名</label>
        <div class="control">
          <input v-model="name" class="input" type="text" />
        </div>
      </div>

      <div class="field">
        <label class="label">本文</label>
        <div class="control editor">
          <editor :text="text" @update-text="updateText" />
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
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import Editor from '~/components/Editor.vue'
import Crop from '~/components/ImageCrop.vue'
import { Page, User } from '../../..'
import { storage } from '~/plugins/firebase'

@Component({
  components: {
    Editor,
    Crop
  },
  apollo: {
    page: {
      prefetch: true,
      variables(): any {
        return {
          id: (this as any).$route.params.id
        }
      },
      query: gql`
        query findPage($id: ID!) {
          page(id: $id) {
            name
            text
            id
            image
            user {
              id
              accountId
              name
              description
            }
          }
        }
      `
    }
  }
})
export default class extends Vue {
  page: Page | null = null
  name = ''
  text = ''
  get pageId() {
    return this.$route.params.id
  }

  get canSubmit() {
    return !!this.name
  }

  created() {
    if (this.page) {
      this.name = this.page.name
      this.text = this.page.text
    }
  }

  async submit() {
    try {
      await (this as any).$apollo.mutate({
        mutation: gql`
          mutation($id: ID!, $name: String!, $text: String!) {
            updatePage(id: $id, input: { name: $name, text: $text }) {
              id
              name
              text
            }
          }
        `,
        // Parameters
        variables: {
          id: this.$route.params.id,
          name: this.name,
          text: this.text
        }
      })
      this.$toast.success('保存しました')
      this.$router.push(`/pages/${this.$route.params.id}`)
    } catch (e) {
      this.$toast.error('保存に失敗しました')
    }
  }

  async submitImage(image: string) {
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
        id: this.$route.params.id,
        image: image
      }
    })
  }

  updateText(text: string) {
    this.text = text
  }

  async saveImage() {
    try {
      const data = (this as any).$refs.crop.getData()
      const storageRef = storage.ref()
      const imagesRef = storageRef.child(
        `user/${this.user.uid}/page/${this.$route.params.id}/main`
      )
      const snapshot = await imagesRef.putString(data, 'data_url')
      const downloadURL = await snapshot.ref.getDownloadURL()
      await this.submitImage(downloadURL)
      this.$toast.success('画像を保存しました')
    } catch (e) {
      console.log(e)
      this.$toast.error('画像の保存に失敗しました')
    }
  }

  get user(): User {
    return this.$store.state.user.user
  }
  get isMyAccountId(): boolean {
    if (!this.page) {
      return false
    }
    return this.$store.getters['user/isMyAccountId'](this.page.user.accountId)
  }
}
</script>
<style scoped>
.main {
  margin-top: 20px;
}

.user {
  margin-top: 50px;
}
</style>
