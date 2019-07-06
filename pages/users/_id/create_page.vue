<template>
  <div class="main">
    <div class="profile-settings box">
      <div class="field">
        <label class="label">ページ名</label>
        <div class="control">
          <input v-model="name" class="input" type="text" />
        </div>
      </div>

      <div class="field">
        <label class="label">本文</label>
        <div class="control">
          <textarea v-model="text" class="textarea" />
        </div>
      </div>
      <div class="has-text-centered">
        <button class="button is-primary" @click="submit">作成</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'

@Component({})
export default class extends Vue {
  name = ''
  text = ''

  get isMyAccountId() {
    return this.$store.getters['user/isMyAccountId'](this.$route.params.id)
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
      console.log(res)
      // this.$store.dispatch('user/updateUser', { user: ret.data.updateUser })
      this.$router.push(`/pages/${res.data.createPage.id}`)
      this.$toast.success('保存しました')
    } catch (e) {
      console.log(e)
      this.$toast.error('保存に失敗しました')
    }
  }
}
</script>
<style>
.box {
  margin: 0 auto;
  max-width: 800px;
}
</style>
