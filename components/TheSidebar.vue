<template>
  <div>
    <h2 class="top">人気記事一覧</h2>
    <template v-for="page in pages">
      <div :key="page.id" class="popular-pages">
        <div class="media popular-page">
          <figure class="media-left">
            <p class="image is-48x48">
              <n-link :to="`/pages/${page.id}`">
                <img :src="page.image" alt />
              </n-link>
            </p>
          </figure>
          <div class="media-content">
            <div class="page-name">
              <n-link :to="`/pages/${page.id}`">
                <small>{{ page.name }}</small>
              </n-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { db } from '~/plugins/firebase'
import gql from 'graphql-tag'
import { Page } from '..'
import { createComponent, onMounted } from '@vue/composition-api'

async function getPV() {
  const pv = await db
    .collection('pv')
    .orderBy('pv', 'desc')
    .limit(5)
    .get()
  return pv
}

async function getPages(pv: firebase.firestore.QuerySnapshot, ctx, pages) {
  pv.docs.forEach(async doc => {
    if (doc.exists) {
      const res = await ctx.root.$apollo.query({
        query: gql`
          query findPage($id: ID!) {
            page(id: $id) {
              id
              name
              image
            }
          }
        `,
        variables: {
          id: doc.id
        }
      })
      pages.push(res.data.page)
    }
  })
}

export default createComponent({
  setup(_, ctx) {
    const pages: Page[] = []

    onMounted(async () => {
      try {
        const pv = await getPV()
        await getPages(pv, ctx, pages)
      } catch (e) {
        console.log(e)
      }
    })

    return {
      pages
    }
  }
})
</script>
<style scoped>
.top {
  margin-bottom: 25px;
}

.popular-pages {
  margin-top: 15px;
}

.popular-page {
  border-left: solid 4px hsl(171, 100%, 41%);
  box-shadow: 1px 1px 3px rgba(179, 179, 179, 0.4);
  padding: 8px 0 8px 8px;
}

.page-name {
  word-break: break-all;
}
</style>
