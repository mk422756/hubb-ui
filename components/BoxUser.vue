<template>
  <div class="box">
    <article class="media">
      <div class="media-left">
        <n-link :to="`/users/${accountId}`">
          <figure class="image is-64x64">
            <img
              class="is-rounded"
              src="https://bulma.io/images/placeholders/128x128.png"
              alt="Image"
            />
          </figure>
        </n-link>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong
              ><n-link :to="`/users/${accountId}`">{{ name }}</n-link></strong
            >
            <small>@{{ accountId }}</small>
            <br />
            {{ description }}
          </p>
        </div>
      </div>
    </article>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class extends Vue {
  @Prop({ default: '' }) readonly name!: string
  @Prop({ default: '' }) readonly accountId!: string
  @Prop({ default: '' }) readonly description!: string
}
</script>
