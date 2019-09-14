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
          :tags="page.tags"
          :created-at="page.createdAt"
        />
      </div>
      <div class="social">
        <span class="twitter">
          <a
            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
            class="twitter-share-button"
            data-show-count="false"
            >Tweet</a
          ><script
            async
            src="https://platform.twitter.com/widgets.js"
            charset="utf-8"
          />
        </span>
        <span class="hatena">
          <a
            href="https://b.hatena.ne.jp/entry/"
            class="hatena-bookmark-button"
            data-hatena-bookmark-layout="basic-label-counter"
            data-hatena-bookmark-lang="ja"
            title="このエントリーをはてなブックマークに追加"
            ><img
              src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png"
              alt="このエントリーをはてなブックマークに追加"
              width="20"
              height="20"
              style="border: none;"/></a
          ><script
            type="text/javascript"
            src="https://b.st-hatena.com/js/bookmark_button.js"
            charset="utf-8"
            async="async"
          />
        </span>
      </div>
      <div class="user">
        <box-user
          :name="page.user.name"
          :account-id="page.user.accountId"
          :description="page.user.description"
          :image="page.user.image"
        />
      </div>

      <div class="carousel">
        <p><strong>同じユーザーの投稿</strong></p>
        <no-ssr>
          <carousel :per-page="3" :loop="true">
            <template v-for="page in page.user.pages">
              <slide :key="page.id">
                <div class="card">
                  <div class="card-content">
                    <n-link :to="`/pages/${page.id}`">
                      <figure class="image container is-64x64">
                        <img v-if="page.image" :src="page.image" />
                        <div v-else class="icon is-large book">
                          <font-awesome-icon
                            icon="book-open"
                            class="fas fa-3x"
                          />
                        </div>
                      </figure>
                    </n-link>
                    <p>
                      <small
                        ><strong>{{ page.name }}</strong></small
                      >
                    </p>
                  </div>
                </div>
              </slide>
            </template>
          </carousel>
        </no-ssr>
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
              pages {
                id
                name
                image
              }
            }
            tags {
              id
              name
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
          content: striptags((this as any).page.text).slice(0, 150)
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
          content: striptags((this as any).page.text).slice(0, 150)
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
          content: striptags((this as any).page.text).slice(0, 150)
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

.carousel {
  margin-top: 30px;
}

.card {
  height: 100%;
  vertical-align: middle;
}

.book {
  color: #ccc;
}

.social {
  margin: 30px 0;
}
</style>
