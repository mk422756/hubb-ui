<template>
  <div v-if="user" class="main">
    <div>
      <!-- <div v-if="isMyAccountId" class="title is-inline">マイページ</div> -->
      <section class="is-clearfix">
        <div class="is-pulled-left">
          <figure class="image is-64x64">
            <img v-if="user.image" class="is-rounded" :src="user.image" />
            <span v-else class="icon is-large">
              <font-awesome-icon icon="user" class="fas fa-3x" />
            </span>
          </figure>
        </div>
        <div class="is-pulled-left user-main">
          <h1 class="is-size-5 has-text-weight-semibold">{{ user.name }}</h1>
          <small>@{{ user.accountId }}</small>
        </div>
        <div class="is-pulled-right">
          <n-link
            v-if="isMyAccountId"
            to="profile"
            class="button is-primary is-small is-outlined"
            append
            >プロフィール変更</n-link
          >
        </div>
      </section>
      <!-- <div class="user columns is-centered">
        <div class="column is-two-thirds">
          <box-user
            :name="user.name"
            :account-id="user.accountId"
            :description="user.description"
            :image="user.image"
          />
        </div>
      </div> -->
      <hr />
      <p class="is-size-5 has-text-weight-semibold page-list">ページ一覧</p>
      <div class="pages">
        <div v-for="page in user.pages" :key="page.id" class="page">
          <box-page
            :id="page.id"
            :name="page.name"
            :text="page.text"
            :image="page.image"
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
import gql from 'graphql-tag'
import BoxUser from '~/components/BoxUser.vue'
import BoxPage from '~/components/BoxPage.vue'
import { User } from '../../..'

@Component({
  components: {
    BoxPage,
    BoxUser
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

  get isMyAccountId() {
    return this.$store.getters['user/isMyAccountId'](this.$route.params.id)
  }
}
</script>
<style scoped>
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

.image {
  margin-top: 20px;
}
.user-main {
  margin-left: 10px;
}
</style>
