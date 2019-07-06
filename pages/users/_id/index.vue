<template>
  <div v-if="user" class="main">
    <div>
      <div v-if="isMyAccountId" class="title is-inline">マイページ</div>
      <div class="buttons is-inline is-pulled-right">
        <button class="button" @click="logout">ログアウト</button>
        <n-link v-if="isMyAccountId" class="button" to="profile" append
          >設定</n-link
        >
      </div>
      <div class="user">
        <user-box
          :name="user.name"
          :account-id="user.accountId"
          :description="user.description"
        />
      </div>
      <p class="title page-list">ページ一覧</p>
      <div class="pages">
        <div v-for="page in user.pages" :key="page.id" class="page">
          <page-box
            :id="page.id"
            :name="page.name"
            :text="page.text"
            :created-at="page.createdAt"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import { auth } from '~/plugins/firebase'
import gql from 'graphql-tag'
import { User } from '~/type'
import UserBox from '~/components/UserBox.vue'
import PageBox from '~/components/PageBox.vue'

@Component({
  components: {
    PageBox,
    UserBox
  },
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
              id
              name
              text
              image
              createdAt
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
<style>
.user {
  margin-top: 20px;
}

.page-list {
  margin-top: 20px;
}

.pages {
  margin-top: 20px;
}

.page {
  margin-top: 10px;
}
</style>
