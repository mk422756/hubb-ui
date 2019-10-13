<template>
  <div>
    <navbar />
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-two-thirds">
            <nuxt />
          </div>
          <div class="column is-one-quarter">
            <sidebar />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Navbar from '~/components/TheNavbar.vue'
import Sidebar from '~/components/TheSidebar.vue'

@Component({
  components: {
    Navbar,
    Sidebar
  }
})
export default class extends Vue {}
</script>
