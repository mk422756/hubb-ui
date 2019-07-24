<template>
  <div class="main">
    <p class="is-size-5">新着ページ一覧</p>
    <div v-for="page in pages" :key="page.id" class="pages">
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import BoxUser from '~/components/BoxUser.vue'
import BoxPage from '~/components/BoxPage.vue'
import gql from 'graphql-tag'

@Component({
  components: {
    BoxUser,
    BoxPage
  },
  apollo: {
    pages: {
      prefetch: true,
      query: gql`
        query {
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
      `
    }
  }
})
export default class extends Vue {
  pages = []
  get user() {
    return this.$store.state.user.user
  }
  get isLogin() {
    return this.$store.getters['user/isLogin']
  }
}
</script>
<style scoped>
.pages {
  margin: 20px 0;
}
</style>
