<template>
  <div v-if="isMyAccountId" class="main">
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
          <editor :text="text" @update-text="updateText" />
        </div>
      </div>
      <div class="has-text-centered create-button">
        <button class="button is-primary" @click="submit">保存</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import { Page } from '~/type'
import gql from 'graphql-tag'
import Editor from '~/components/Editor.vue'

@Component({
  components: {
    Editor
  },
  apollo: {
    page: {
      prefetch: true,
      variables(): any {
        return {
          id: this.$route.params.id
        }
      },
      query: gql`
        query findPage($id: ID!) {
          page(id: $id) {
            name
            text
            id
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

  updateText(text: string) {
    this.text = text
  }

  get isMyAccountId(): boolean {
    if (!this.page) {
      return false
    }
    return this.$store.getters['user/isMyAccountId'](this.page.user.accountId)
  }
}
</script>
<style>
.main {
  margin-top: 20px;
}

.user {
  margin-top: 50px;
}
</style>
