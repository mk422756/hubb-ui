<template>
  <div class="container">
    <div class="box">
      <h1 class="is-size-5 has-text-weight-semibold title">パスワード変更</h1>
      <div class="field">
        <label class="label">古いパスワード</label>
        <div class="control">
          <input v-model="oldPassword" class="input" type="password" />
        </div>
      </div>
      <div class="field">
        <label class="label">新しいパスワード</label>
        <div class="control">
          <input v-model="newPassword" class="input" type="password" />
        </div>
      </div>
      <div class="has-text-danger">
        {{ errMsg }}
      </div>
      <div class="has-text-centered">
        <button
          class="button is-primary"
          :class="{ 'is-loading': changing }"
          @click="change"
        >
          変更
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import firebase from 'firebase/app'
import { User } from '../../..'

@Component({})
export default class extends Vue {
  oldPassword = ''
  newPassword = ''
  errMsg = ''
  changing = false

  get user(): User {
    return this.$store.state.user.user
  }

  async change() {
    const user = firebase.auth().currentUser
    if (!user || !user.email) {
      window.alert('認証エラー')
      return
    }

    try {
      this.changing = true
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.oldPassword
      )
      await user.reauthenticateWithCredential(credential)
      await user.updatePassword(this.newPassword)

      this.$toast.success('パスワードを変更しました')
      this.$router.push(`/users/${this.user.accountId}`)
    } catch (e) {
      if (e.code === 'auth/wrong-password') {
        this.errMsg = 'パスワードが違います'
      } else {
        window.alert('エラーが発生しました')
      }
      this.changing = false
    }
  }
}
</script>
