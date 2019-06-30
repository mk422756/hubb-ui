<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <n-link class="navbar-item" to="/">
        <img
          src="https://bulma.io/images/bulma-logo.png"
          width="112"
          height="28"
        />
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
      <!-- <div class="navbar-start">
        <a class="navbar-item"> Home </a>

        <a class="navbar-item">
          Documentation
        </a>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            More
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item">
              About
            </a>
            <a class="navbar-item">
              Jobs
            </a>
            <a class="navbar-item">
              Contact
            </a>
            <hr class="navbar-divider" />
            <a class="navbar-item">
              Report an issue
            </a>
          </div>
        </div>
      </div> -->

      <div class="navbar-end">
        <div class="navbar-item">
          <div v-if="!isLogin" class="buttons">
            <n-link class="button is-primary" to="/signup">
              <strong>Sign up</strong>
            </n-link>
            <n-link class="button is-light" to="/login">
              Log in
            </n-link>
          </div>
          <div v-else>
            <span class="is-size-5 has-text-weight-bold	">{{ user.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({})
export default class extends Vue {
  openBurger = false
  toggleBurger() {
    this.openBurger = !this.openBurger
  }

  get user() {
    return this.$store.state.user.user
  }

  get isLogin(): boolean {
    return !!this.$store.state.user.user
  }
}
</script>
