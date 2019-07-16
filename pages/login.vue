<template>
  <div class="container">
    <div class="box">
      <h1 class="is-size-5 has-text-weight-semibold title">ログイン</h1>
      <div class="field">
        <label class="label">メールアドレス</label>
        <div class="control">
          <input v-model.trim="email" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label">パスワード</label>
        <div class="control">
          <input v-model.trim="password" class="input" type="password" />
        </div>
      </div>
      <p class="has-text-danger">{{ errMsg }}</p>
      <div class="has-text-centered">
        <button class="button is-primary" @click="submit">新規作成</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import { auth } from '~/plugins/firebase'
import gql from 'graphql-tag'
import { User } from '..'

@Component({})
export default class extends Vue {
  email = ''
  password = ''
  errMsg = ''

  async submit() {
    try {
      const cred = await auth.signInWithEmailAndPassword(
        this.email,
        this.password
      )
      if (!cred.user) {
        throw new Error()
      }
      const user = await this.getUser(cred.user.uid)
      this.$router.push('/users/' + user.accountId)
    } catch (e) {
      if (e.code === 'auth/invalid-email') {
        this.errMsg = 'メールアドレスの形式が正しくありません'
      } else if (
        e.code === 'auth/user-not-found' ||
        e.code === 'auth/wrong-password'
      ) {
        this.errMsg = 'パスワードが違います'
      } else {
        this.errMsg = 'エラーが発生しました。もう一度やり直してください'
      }
      console.log(e)
      console.log(e.code, e.message)
    }
  }

  async getUser(uid: string): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret = await (this as any).$apollo.query({
      prefetch: true,
      query: gql`
        query findUser($uid: String!) {
          user(uid: $uid) {
            accountId
          }
        }
      `,
      variables: {
        uid: uid
      }
    })
    return ret.data.user
  }
}
</script>
<style scoped>
.box {
  margin: 0 auto;
  max-width: 600px;
}
</style>
