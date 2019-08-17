<template>
  <nav
    class="navbar is-spaced	has-shadow"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <n-link class="navbar-item" to="/">
        <img src="@/assets/image/logo.png" />
      </n-link>
      <n-link
        v-if="isLogin && user"
        class="navbar-item"
        :to="`/users/${user.accountId}/create_page`"
      >
        <button class="button is-primary is-outlined is-small">
          <font-awesome-icon icon="pencil-alt" />
          <span style="margin-left: 5px;">新規ページ</span>
        </button>
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
              <strong>新規登録</strong>
            </n-link>
            <n-link class="button is-light" to="/login">
              ログイン
            </n-link>
          </div>
          <div v-else>
            <a class="navbar-link">
              <img class="user-image" :src="user.image" /><span
                class="nav-username"
                >{{ user.name }}</span
              >
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

.nav-username {
  margin-left: 5px;
}
</style>
