<template>
  <div v-if="tag">
    <h1 class="title">{{ tag.name }}</h1>
    <div v-for="page in tag.pages" :key="page.id" class="pages">
      <box-page
        :id="page.id"
        :name="page.name"
        :text="page.text"
        :created-at="page.createdAt"
        :image="page.image"
        :user-name="page.user.name"
        :user-account-id="page.user.accountId"
        :user-image="page.user.image"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api'
import gql from 'graphql-tag'
import BoxPage from '~/components/BoxPage.vue'

export default createComponent({
  components: {
    BoxPage
  },
  apollo: {
    tag: {
      prefetch: true,
      variables() {
        return {
          id: (this as any).id
        }
      },
      query: gql`
        query findTag($id: ID!) {
          tag(id: $id) {
            name
            pages {
              id
              text
              name
              image
              createdAt
              user {
                id
                name
                accountId
                image
              }
            }
          }
        }
      `
    }
  },
  setup(props, ctx) {
    const id = ctx.root.$route.params.id

    return {
      id
    }
  }
})
</script>
<style scoped>
.pages {
  margin: 20px 0;
}
</style>
