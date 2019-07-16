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
        <p class="help is-danger">{{ passwordError }}</p>
      </div>
      <div class="has-text-danger">
        {{ errMsg }}
      </div>
      <div class="has-text-centered">
        <button
          class="button is-primary"
          :class="{ 'is-loading': changing }"
          :disabled="!canSubmit"
          @click="change"
        >
          変更
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import firebase from 'firebase/app'
import { User } from '../../..'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

@Component({
  validations: {
    newPassword: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(20)
    }
  }
})
export default class extends Vue {
  oldPassword = ''
  newPassword = ''
  errMsg = ''
  changing = false

  get user(): User {
    return this.$store.state.user.user
  }

  get canSubmit(): boolean {
    return this.$v && !this.$v.$invalid && !!this.oldPassword
  }

  get passwordError(): string {
    if (!this.$v) {
      return ''
    } else if (!(this as any).$v.newPassword.minLength) {
      return '8文字以上で入力してください'
    } else if (!(this as any).$v.newPassword.maxLength) {
      return '20文字以内で入力してください'
    }
    return ''
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
        this.errMsg = 'エラーが発生しました。もう一度やり直してください'
      }
      console.log(e)
      this.changing = false
    }
  }
}
</script>
