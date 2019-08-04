<template>
  <div v-if="page && page.user" class="columns  is-centered">
    <div class="column is-four-fifths">
      <div class="is-clearfix">
        <div v-if="isMyAccountId" class="buttons is-pulled-right">
          <n-link to="edit" class="button is-primary is-outlined" append
            >編集</n-link
          >
          <button class="button is-danger is-outlined" @click="deletePage">
            削除
          </button>
        </div>
      </div>
      <div v-if="page.image" class="has-text-centered ">
        <figure class="image container is-128x128">
          <img
            :src="page.image"
            alt="page main image"
            class="is-inline-block"
          />
        </figure>
      </div>
      <div class="main-view">
        <page-main-view
          :name="page.name"
          :text="page.text"
          :created-at="page.createdAt"
        />
      </div>
      <div class="user">
        <box-user
          :name="page.user.name"
          :account-id="page.user.accountId"
          :description="page.user.description"
          :image="page.user.image"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import PageMainView from '~/components/PageMainView.vue'
import gql from 'graphql-tag'
import BoxUser from '~/components/BoxUser.vue'
import { Page } from '../../..'
import striptags from 'striptags'

@Component({
  components: {
    BoxUser,
    PageMainView
  },
  apollo: {
    page: {
      prefetch: true,
      variables(): any {
        return {
          id: (this as any).$route.params.id
        }
      },
      query: gql`
        query findPage($id: ID!) {
          page(id: $id) {
            name
            text
            id
            image
            createdAt
            user {
              id
              accountId
              name
              description
              image
            }
          }
        }
      `
    }
  },
  head() {
    return {
      title: `${(this as any).page.name}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: striptags((this as any).page.text)
        },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${(this as any).page.name}`
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: striptags((this as any).page.text)
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${(this as any).page.image}`
        },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: `${(this as any).page.name}` },
        { name: 'twitter:image', content: `${(this as any).page.image}` },
        {
          name: 'twitter:description',
          content: striptags((this as any).page.text)
        }
      ]
    }
  }
})
export default class extends Vue {
  page: Page = {} as any

  get pageId() {
    return this.$route.params.id
  }

  get isMyAccountId() {
    return this.$store.getters['user/isMyAccountId'](this.page.user.accountId)
  }

  get user() {
    return this.$store.state.user.user
  }

  async deletePage() {
    try {
      if (!window.confirm('ページを削除します。よろしいですか？')) {
        return
      }
      await (this as any).$apollo.mutate({
        mutation: gql`
          mutation($id: ID!) {
            deletePage(id: $id)
          }
        `,
        // Parameters
        variables: {
          id: this.$route.params.id
        }
      })
      this.$toast.success('ページを削除しました')
      this.$router.push(`/users/${this.user.accountId}`)
    } catch (e) {
      console.log(e)
      this.$toast.error('ページの削除に失敗しました')
    }
  }
}
</script>
<style scoped>
.main {
  margin-top: 20px;
}

.user {
  margin-top: 50px;
}

.main-view {
  margin-top: 50px;
}
</style>
