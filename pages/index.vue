<template>
  <div class="main">
    <div>
      {{ user }}
      <div>
        <n-link class="button" to="signup">Sign up</n-link><br />
        <n-link class="button" to="login">Login</n-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'

@Component({
  apollo: {
    user: {
      prefetch: true,
      variables(): any {
        return {
          id: 1
        }
      },
      query: gql`
        query findUser($id: ID!) {
          user(id: $id) {
            name
            accountId
            image
            description
            pages {
              name
              text
              image
            }
          }
        }
      `
    }
  }
})
export default class extends Vue {
  user = {}
}
</script>
