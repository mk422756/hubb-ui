<template>
  <nav
    class="navbar is-spaced	has-shadow"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <n-link class="navbar-item" to="/">
        <img
          src="https://bulma.io/images/bulma-logo.png"
          width="112"
          height="28"
        />
      </n-link>
      <n-link
        v-if="isLogin && user"
        class="navbar-item"
        :to="`/users/${user.accountId}/create_page`"
      >
        <button class="button is-primary is-outlined">新規ページ作成</button>
      </n-link>
      <a
        role="button"
        class="navbar-burger burger"
        :class="{ 'is-active': openBurger }"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="toggleBurger"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div
      id="navbarBasicExample"
      class="navbar-menu"
      :class="{ 'is-active': openBurger }"
    >
      <div class="navbar-end">
        <div class="navbar-item  has-dropdown is-hoverable">
          <div v-if="!isLogin" class="buttons">
            <n-link class="button is-primary" to="/signup">
              <strong>Sign up</strong>
            </n-link>
            <n-link class="button is-light" to="/login">
              Log in
            </n-link>
          </div>
          <div v-else>
            <a class="navbar-link">
              <img class="user-image" :src="user.image" /><span>{{
                user.name
              }}</span>
            </a>
            <div class="navbar-dropdown is-right">
              <n-link class="navbar-item" :to="`/users/${user.accountId}`">
                マイページ
              </n-link>
              <n-link
                class="navbar-item"
                :to="`/users/${user.accountId}/settings`"
              >
                設定
              </n-link>
              <hr class="navbar-divider" />
              <a class="navbar-item" @click="logout">
                ログアウト
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { User } from '..'
import { auth } from '~/plugins/firebase'

@Component({})
export default class extends Vue {
  openBurger = false
  toggleBurger() {
    this.openBurger = !this.openBurger
  }

  async logout() {
    await auth.signOut()
    this.$toast.success('ログアウトしました')
    this.$router.push('/')
  }

  get user(): User {
    return this.$store.state.user.user
  }

  get isLogin(): boolean {
    return !!this.$store.state.user.user
  }
}
</script>
<style>
.user-image {
  vertical-align: middle;
}
</style>
