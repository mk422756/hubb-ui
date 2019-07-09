<template>
  <div v-if="page && page.user">
    <div v-if="isMyAccountId">
      <n-link to="edit" class="button is-primary is-pulled-right" append
        >編集</n-link
      >
    </div>
    <div class="main-view">
      <page-main-view
        :name="page.name"
        :text="page.text"
        :created-at="page.createdAt"
      />
    </div>
    <div class="user">
      <user-box
        :name="page.user.name"
        :account-id="page.user.accountId"
        :description="page.user.description"
      />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import PageMainView from '~/components/PageMainView.vue'
import gql from 'graphql-tag'
import UserBox from '~/components/UserBox.vue'

@Component({
  components: {
    UserBox,
    PageMainView
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
            createdAt
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
  page = {} as any
  get pageId() {
    return this.$route.params.id
  }

  get isMyAccountId() {
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

.main-view {
  width: 800px;
  margin: 0 auto;
}
</style>
