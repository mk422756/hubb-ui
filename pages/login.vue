<template>
  <div class="container">
    <div class="box">
      <h1 class="is-size-5 has-text-weight-semibold title">ログイン</h1>
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
import { auth } from '~/plugins/firebase'

@Component({})
export default class extends Vue {
  email = ''
  password = ''

  async submit() {
    try {
      const cred = await auth.signInWithEmailAndPassword(
        this.email,
        this.password
      )
      if (!cred.user) {
        throw new Error()
      }
      this.$router.push('/users/' + cred.user.uid)
    } catch (e) {
      console.log(e)
      console.log(e.code, e.message)
    }
  }
}
</script>

<style>
.box {
  margin: 100px auto;
  max-width: 600px;
}
</style>
