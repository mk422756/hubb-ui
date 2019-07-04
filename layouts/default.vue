<template>
  <div>
    <navbar />
    <section class="section">
      <div class="container">
        <nuxt />
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Navbar from '~/components/TheNavbar.vue'

@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {}
</script>
