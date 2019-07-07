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
<style>
h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.75rem;
}

h3 {
  font-size: 1.5rem;
}

blockquote {
  position: relative;
  padding: 20px 15px 8px 15px;
  box-sizing: border-box;
  font-style: italic;
  background: #efefef;
  color: #555;
}
blockquote:before {
  display: inline-block;
  position: absolute;
  top: 5px;
  left: 3px;
  content: '“';
  font-family: sans-serif;
  color: #cfcfcf;
  font-size: 50px;
  line-height: 1;
}
blockquote p {
  padding: 0;
  margin: 10px 0;
  line-height: 1.7;
}

blockquote cite {
  display: block;
  text-align: right;
  color: #888888;
  font-size: 0.9em;
}
</style>
