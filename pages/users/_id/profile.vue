<template>
  <div class="main">
    <div class="profile-settings box">
      <n-link v-if="user" :to="'/users/' + user.accountId">戻る</n-link>
      <h1 class="title">プロフィール設定</h1>
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
import { User } from '~/type'
import gql from 'graphql-tag'

@Component({})
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

  get birthYear() {
    return 1
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

  async submit() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      this.$toast.success('保存しました')
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
