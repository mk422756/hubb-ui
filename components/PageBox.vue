<template>
  <div class="box">
    <article class="media">
      <div class="media-left">
        <n-link :to="`/pages/${id}`">
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
              ><n-link :to="`/pages/${id}`">{{ name }}</n-link></strong
            >
            <small>{{ formattedCreatedAt }}</small>
            <br />
            {{ text }}
          </p>
        </div>
      </div>
    </article>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import dayjs from 'dayjs'

@Component({})
export default class extends Vue {
  @Prop({ default: '' }) readonly id!: string
  @Prop({ default: '' }) readonly name!: string
  @Prop({ default: '' }) readonly text!: string
  @Prop({ default: '' }) readonly createdAt!: string

  get formattedCreatedAt() {
    return this.createdAt === ''
      ? ''
      : dayjs(this.createdAt).format('YYYY/MM/DD HH:mm:ss')
  }
}
</script>
