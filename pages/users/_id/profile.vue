<template>
  <div v-if="user" class="main">
    <div class="profile-settings box">
      <n-link v-if="user" :to="'/users/' + user.accountId">戻る</n-link>
      <h1 class="title">プロフィール設定</h1>
      <div>
        <h2 class="has-text-weight-semibold is-size-5">プロフィール画像</h2>
        <div class="has-text-centered">
          <crop ref="crop" :image="user.image" />
          <button class="button is-primary" @click="getImage">
            画像保存
          </button>
        </div>
      </div>
      <hr />
      <div class="field">
        <label class="label">ユーザー名</label>
        <div class="control">
          <input v-model="name" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label">自己紹介</label>
        <div class="control">
          <textarea v-model="description" class="textarea" />
        </div>
      </div>
      <div class="field">
        <label class="label">Twitter ID</label>
        <div class="control">
          <input v-model="twitter" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label">Facebook ID</label>
        <div class="control">
          <input v-model="facebook" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label">Instagram ID</label>
        <div class="control">
          <input v-model="instagram" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label">ホームページ URL</label>
        <div class="control">
          <input v-model="homepage" class="input" type="text" />
        </div>
      </div>
      <div class="has-text-centered">
        <button class="button is-primary" @click="submit">変更</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component, Watch } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { User } from '../../..'
import Crop from '~/components/ImageCrop.vue'
import { storage } from '~/plugins/firebase'

@Component({
  components: {
    Crop
  }
})
export default class extends Vue {
  name = ''
  description = ''
  twitter = ''
  facebook = ''
  instagram = ''
  homepage = ''
  birthday = ''

  get user(): User {
    return this.$store.state.user.user
  }

  @Watch('user', { immediate: true, deep: true })
  onUserChanged(user: User) {
    if (!user) {
      return
    }
    this.name = user.name
    this.description = user.description
    this.twitter = user.twitter
    this.facebook = user.facebook
    this.instagram = user.instagram
    this.homepage = user.homepage
    this.birthday = user.birthday
  }

  async getImage() {
    try {
      const data = (this as any).$refs.crop.getData()
      const storageRef = storage.ref()
      const imagesRef = storageRef.child(`user/${this.user.uid}/main`)
      const snapshot = await imagesRef.putString(data, 'data_url')
      const downloadURL = await snapshot.ref.getDownloadURL()
      await this.submitImage(downloadURL)
      this.$store.dispatch('user/updateImage', { image: downloadURL })
      this.$toast.success('画像を保存しました')
    } catch (e) {
      console.log(e)
      this.$toast.error('画像の保存に失敗しました')
    }
  }

  async submit() {
    try {
      const ret = await (this as any).$apollo.mutate({
        mutation: gql`
          mutation(
            $id: ID!
            $name: String!
            $description: String!
            $twitter: String!
            $homepage: String!
            $instagram: String!
            $facebook: String!
          ) {
            updateUser(
              id: $id
              input: {
                name: $name
                description: $description
                twitter: $twitter
                homepage: $homepage
                instagram: $instagram
                facebook: $facebook
              }
            ) {
              id
              name
              accountId
              image
              description
              twitter
              facebook
              instagram
              homepage
              image
              birthday
            }
          }
        `,
        // Parameters
        variables: {
          id: this.user.id,
          name: this.name,
          description: this.description,
          twitter: this.twitter,
          homepage: this.homepage,
          instagram: this.instagram,
          facebook: this.facebook
        }
      })
      this.$store.dispatch('user/updateUser', { user: ret.data.updateUser })
      this.$toast.success('プロフィール変更を保存しました')
    } catch (e) {
      console.log(e)
      this.$toast.error('プロフィール変更の保存に失敗しました')
    }
  }
  async submitImage(image: string) {
    try {
      const ret = await (this as any).$apollo.mutate({
        mutation: gql`
          mutation($id: ID!, $image: String!) {
            updateUser(id: $id, input: { image: $image }) {
              id
              image
            }
          }
        `,
        // Parameters
        variables: {
          id: this.user.id,
          image: image
        }
      })
      console.log(ret)
      // this.$store.dispatch('user/updateUser', { user: ret.data.updateUser })
      // this.$toast.success('保存しました')
    } catch (e) {
      this.$toast.error('保存に失敗しました')
    }
  }
}
</script>
<style scoped>
.box {
  margin: 0 auto;
  max-width: 800px;
}

.title {
  margin-top: 10px;
}
</style>
