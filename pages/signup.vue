<template>
  <div class="container">
    <div class="box">
      <h1 class="is-size-5 has-text-weight-semibold title">新規作成</h1>
      <div class="field">
        <label class="label">ユーザー名</label>
        <div class="control">
          <input v-model.trim="name" class="input" type="text" />
        </div>
      </div>
      <div class="field">
        <label class="label"
          >アカウントID<small>(登録後に変更できません)</small></label
        >
        <div class="control">
          <input v-model.trim="accountId" class="input" type="text" />
        </div>
        <p class="help has-text-info">{{ accountIdError }}</p>
      </div>
      <div class="field">
        <label class="label">メールアドレス</label>
        <div class="control">
          <input v-model.trim="email" class="input" type="text" />
        </div>
        <p class="help has-text-info">{{ emailError }}</p>
      </div>
      <div class="field">
        <label class="label">パスワード</label>
        <div class="control">
          <input v-model.trim="password" class="input" type="password" />
        </div>
        <p class="help has-text-info">{{ passwordError }}</p>
      </div>
      <p class="has-text-danger">{{ errMsg }}</p>
      <div class="has-text-centered">
        <button
          class="button is-primary"
          :disabled="!canSubmit"
          @click="submit"
        >
          新規作成
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { auth } from '~/plugins/firebase'
import {
  alphaNum,
  required,
  minLength,
  maxLength,
  email
} from 'vuelidate/lib/validators'

@Component({
  validations: {
    name: {
      required
    },
    accountId: {
      required,
      alphaNum,
      minLength: minLength(4),
      maxLength: maxLength(20)
    },
    email: { required, email },
    password: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(20)
    }
  }
})
export default class extends Vue {
  name = ''
  accountId = ''
  email = ''
  password = ''
  errMsg = ''

  async submit() {
    try {
      const cred = await auth.createUserWithEmailAndPassword(
        this.email,
        this.password
      )
      if (!cred.user) {
        throw new Error()
      }
      const ret = await (this as any).$apollo.mutate({
        mutation: gql`
          mutation createUser(
            $name: String!
            $accountId: String!
            $uid: String!
          ) {
            createUser(
              input: { name: $name, accountId: $accountId, uid: $uid }
            ) {
              accountId
            }
          }
        `,
        variables: {
          name: this.name,
          accountId: this.accountId,
          uid: cred.user.uid
        }
      })
      this.$router.push('/users/' + ret.data.createUser.accountId)
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        this.errMsg = 'メールアドレスはすでに使用されています'
      } else {
        this.errMsg = 'エラーが発生しました。もう一度やり直してください'
      }
      console.log(e)
      console.log(e.code, e.message)
    }
  }

  get canSubmit(): boolean {
    return this.$v && !this.$v.$invalid
  }

  get accountIdError(): string {
    if (!this.$v) {
      return ''
    } else if (!(this as any).$v.accountId.minLength) {
      return '4文字以上で入力してください'
    } else if (!(this as any).$v.accountId.maxLength) {
      return '20文字以内で入力してください'
    } else if (!(this as any).$v.accountId.alphaNum) {
      return '英数字で入力してください'
    }
    return ''
  }

  get emailError(): string {
    if (!this.$v) {
      return ''
    } else if (!(this as any).$v.email.email) {
      return 'メールアドレスの形式が正しくありません'
    }
    return ''
  }

  get passwordError(): string {
    if (!this.$v) {
      return ''
    } else if (!(this as any).$v.password.minLength) {
      return '8文字以上で入力してください'
    } else if (!(this as any).$v.password.maxLength) {
      return '20文字以内で入力してください'
    }
    return ''
  }
}
</script>
<style scoped>
.box {
  margin: 0 auto;
  max-width: 600px;
}
</style>
