<template>
  <div class="main">
    <div>
      <div>{{ user }}</div>
      {{ isMyAccountId }}
      <button class="button" @click="logout">ログアウト</button><br />
      <n-link v-if="isMyAccountId" class="button" to="profile" append
        >設定</n-link
      >
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import { auth } from '~/plugins/firebase'
import gql from 'graphql-tag'
import { User } from '~/type'

@Component({
  apollo: {
    user: {
      prefetch: true,
      variables(): any {
        return {
          accountId: (this as any).$route.params.id
        }
      },
      query: gql`
        query findUser($accountId: String!) {
          user(accountId: $accountId) {
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
  user: User | null = null

  async logout() {
    await auth.signOut()
    this.$router.push('/')
  }

  get isMyAccountId() {
    return this.$store.getters['user/isMyAccountId'](this.$route.params.id)
  }
}
</script>
