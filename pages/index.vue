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

<style>
.main {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
