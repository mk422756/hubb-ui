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
        <div class="control editor">
          <!-- <textarea v-model="text" class="textarea" /> -->
          <editor :text="text" @update-text="updateText" />
        </div>
      </div>
      <div class="has-text-centered create-button">
        <button class="button is-primary" @click="submit">作成</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import Editor from '~/components/Editor.vue'

@Component({
  components: {
    Editor
  }
})
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
      this.$router.push(`/pages/${res.data.createPage.id}`)
      this.$toast.success('保存しました')
    } catch (e) {
      console.log(e)
      this.$toast.error('保存に失敗しました')
    }
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
