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
            {{ strippedText }}
          </p>
        </div>

        <div v-if="userAccountId" class="level">
          <div class="level-left">
            <figure class="image is-32x32 level-item">
              <n-link :to="'/users/' + userAccountId">
                <img
                  class="is-rounded"
                  src="https://bulma.io/images/placeholders/128x128.png"
                  alt="Image"
                />
              </n-link>
            </figure>
            <p class="level-item">By {{ userName }} @{{ userAccountId }}</p>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import dayjs from 'dayjs'
import striptags from 'striptags'

@Component({})
export default class extends Vue {
  @Prop({ default: '' }) readonly id!: string
  @Prop({ default: '' }) readonly name!: string
  @Prop({ default: '' }) readonly text!: string
  @Prop({ default: '' }) readonly createdAt!: string
  @Prop({ default: '' }) readonly userName!: string
  @Prop({ default: '' }) readonly userAccountId!: string

  get formattedCreatedAt(): string {
    return this.createdAt === ''
      ? ''
      : dayjs(this.createdAt).format('YYYY/MM/DD HH:mm:ss')
  }

  get strippedText(): string {
    return striptags(this.text).substring(0, 100)
  }
}
</script>
<style scoped>
.is-vertical-center {
  display: flex;
  align-items: center;
}
</style>
