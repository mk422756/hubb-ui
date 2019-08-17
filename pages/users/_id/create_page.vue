<template>
  <page-edit @submit="submit" />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { storage } from '~/plugins/firebase'
import { User } from '../../..'
import PageEdit from '~/components/PageEdit.vue'
import { EditParam } from '~/components/PageEdit.vue'

@Component({
  components: {
    PageEdit
  }
})
export default class extends Vue {
  get user(): User {
    return this.$store.state.user.user
  }

  async submit(param: EditParam) {
    try {
      const res = await (this as any).$apollo.mutate({
        mutation: gql`
          mutation(
            $name: String!
            $text: String!
            $userId: ID!
            $tags: [String]
          ) {
            createPage(
              input: { text: $text, name: $name, userId: $userId, tags: $tags }
            ) {
              id
            }
          }
        `,
        variables: {
          name: param.name,
          text: param.text,
          userId: this.$store.state.user.user.id,
          tags: param.tags
        }
      })
      if (param.image) {
        await this.saveImage(res.data.createPage.id, param.image)
      }
      this.$router.push(`/pages/${res.data.createPage.id}`)
      this.$toast.success('保存しました')
    } catch (e) {
      console.log(e)
      this.$toast.error('保存に失敗しました')
    }
  }

  async saveImage(pageId: string, data: string): Promise<any> {
    if (!data) {
      return Promise.reject()
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
}
</script>
