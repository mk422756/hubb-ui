<template>
  <page-edit
    v-if="isMyAccountId && page"
    :name="page.name"
    :text="page.text"
    :image="page.image"
    :tag="tagsToString"
    @submit="submit"
  />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { Page, User } from '../../..'
import { storage } from '~/plugins/firebase'
import PageEdit from '~/components/PageEdit.vue'
import { EditParam } from '~/components/PageEdit.vue'

@Component({
  components: {
    PageEdit
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
            tags {
              name
            }
          }
        }
      `
    }
  }
})
export default class extends Vue {
  page: Page | null = null

  get tagsToString(): string {
    if (this.page) {
      return this.page.tags.map(tag => tag.name).join(',')
    }
    return ''
  }

  async submit(param: EditParam) {
    try {
      await (this as any).$apollo.mutate({
        mutation: gql`
          mutation($id: ID!, $name: String!, $text: String!, $tags: [String]) {
            updatePage(
              id: $id
              input: { name: $name, text: $text, tags: $tags }
            ) {
              id
              name
              text
            }
          }
        `,
        // Parameters
        variables: {
          id: this.$route.params.id,
          name: param.name,
          text: param.text,
          tags: param.tags
        }
      })
      if (param.image) {
        await this.saveImage(param.image)
      }
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

  async saveImage(data: string) {
    try {
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
