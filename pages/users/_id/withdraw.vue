<template>
  <div class="container">
    <div class="box">
      <h1 class="is-size-5 has-text-weight-semibold title">退会</h1>
      <div class="field">
        <label class="label">パスワード確認</label>
        <div class="control">
          <input v-model="password" class="input" type="password" />
        </div>
      </div>
      <div class="has-text-danger">
        {{ errMsg }}
      </div>
      <div class="has-text-centered">
        <button
          class="button is-danger"
          :class="{ 'is-loading': deleting }"
          @click="withdraw"
        >
          退会
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import firebase from 'firebase/app'
import gql from 'graphql-tag'

@Component({})
export default class extends Vue {
  password = ''
  errMsg = ''
  deleting = false

  get user() {
    return this.$store.state.user.user
  }

  async withdraw() {
    const user = firebase.auth().currentUser
    if (!user || !user.email) {
      window.alert('認証エラー')
      return
    }

    try {
      this.deleting = true
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.password
      )
      await user.reauthenticateWithCredential(credential)
      await user.delete()
      await (this as any).$apollo.mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteUser(id: $id)
          }
        `,
        variables: {
          id: this.user.id
        }
      })
      this.$toast.success('退会が完了しました')
      this.$router.push('/')
    } catch (e) {
      if (e.code === 'auth/wrong-password') {
        this.errMsg = 'パスワードが違います'
      } else {
        this.errMsg = 'エラーが発生しました。もう一度やり直してください'
      }
      this.deleting = false
    }
  }
}
</script>
