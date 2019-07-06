<template>
  <div v-if="page && page.user">
    <div>
      <p class="title">{{ page.name }}</p>
    </div>
    <div class="main">
      <pre>{{ page.text }}</pre>
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
import gql from 'graphql-tag'
import UserBox from '~/components/UserBox.vue'

@Component({
  components: {
    UserBox
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
  page = {}
  get pageId() {
    return this.$route.params.id
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
