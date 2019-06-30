<template>
  <div class="container">
    <div class="box">
      <h1 class="is-size-5 has-text-weight-semibold title">新規作成</h1>
      <div class="field">
        <label class="label">ユーザー名</label>
        <div class="control">
          <input v-model="name" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label">アカウントID</label>
        <div class="control">
          <input v-model="accountId" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label">メールアドレス</label>
        <div class="control">
          <input v-model="email" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label">パスワード</label>
        <div class="control">
          <input v-model="password" class="input" type="password" />
        </div>
      </div>

      <div class="has-text-centered">
        <button class="button is-primary" @click="submit">新規作成</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { auth } from '~/plugins/firebase'

@Component({})
export default class extends Vue {
  name = ''
  accountId = ''
  email = ''
  password = ''

  async submit() {
    try {
      const cred = await auth.createUserWithEmailAndPassword(
        this.email,
        this.password
      )
      if (!cred.user) {
        throw new Error()
      }

      await (this as any).$apollo.mutate({
        mutation: gql`
          mutation createUser(
            $name: String!
            $accountId: String!
            $uid: String!
          ) {
            createUser(
              input: { name: $name, accountId: $accountId, uid: $uid }
            ) {
              name
            }
          }
        `,
        variables: {
          name: this.name,
          accountId: this.accountId,
          uid: cred.user.uid
        }
      })
    } catch (e) {
      console.log(e)
      console.log(e.code, e.message)
    }
  }

  async test() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const test = await (this as any).$apollo.query({
      prefetch: true,
      query: gql`
        query findUser {
          user(id: 1) {
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
    })
    console.log(test)
  }
}
</script>

<style>
.box {
  margin: 100px auto;
  max-width: 600px;
}
</style>
