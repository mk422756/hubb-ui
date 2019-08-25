<template>
  <div v-if="user" class="main">
    <div>
      <section class="columns is-mobile">
        <div
          class="column is-one-fifth"
          style="margin: auto; padding-right: 0;"
        >
          <figure class="image">
            <img v-if="user.image" :src="user.image" />
            <span v-else class="icon is-large">
              <font-awesome-icon icon="user" class="fas fa-3x" />
            </span>
          </figure>
        </div>
        <div class="column">
          <div class="is-clearfix">
            <div class="is-pulled-left">
              <h1 class="is-size-5 has-text-weight-semibold">
                {{ user.name }}
              </h1>
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
          </div>
          <div class="description">
            <p>{{ user.description }}</p>
          </div>
          <div class="icons">
            <a
              v-if="user.twitter"
              :href="`https://twitter.com/${user.twitter}`"
            >
              <font-awesome-icon class="twitter" :icon="['fab', 'twitter']" />
            </a>
            <a
              v-if="user.facebook"
              :href="`https://facebook.com/${user.facebook}`"
            >
              <font-awesome-icon class="facebook" :icon="['fab', 'facebook']" />
            </a>
            <a
              v-if="user.instagram"
              :href="`https://instagram.com/${user.instagram}`"
            >
              <font-awesome-icon
                class="instagram"
                :icon="['fab', 'instagram']"
              />
            </a>
            <a v-if="user.homepage" :href="user.homepage">
              <font-awesome-icon class="homepage" icon="home" />
            </a>
          </div>
        </div>
      </section>
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
            twitter
            instagram
            facebook
            homepage
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
  },
  head() {
    if (!(this as any).user) {
      return {}
    }
    return {
      title: (this as any).user.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: (this as any).user.description
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${(this as any).user.name}`
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: (this as any).user.description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${(this as any).user.image}`
        },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: `${(this as any).user.name}` },
        { name: 'twitter:image', content: `${(this as any).user.image}` },
        {
          name: 'twitter:description',
          content: (this as any).user.description
        }
      ]
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

.description {
  margin-top: 3px;
  font-size: 0.85rem;
}
.icons {
  margin-top: 3px;
}

.icons a {
  margin-right: 5px;
}

.twitter {
  color: #1da1f2;
}

.facebook {
  color: #3b5998;
}

.instagram {
  color: #e95950;
}

.homepage {
  color: #ffb3b3;
}
</style>
