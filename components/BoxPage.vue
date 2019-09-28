<template>
  <div class="box">
    <article class="media">
      <div class="media-left">
        <n-link :to="`/pages/${id}`">
          <figure class="image is-64x64">
            <img v-if="image" :src="image" :alt="name" />
            <span v-else class="icon is-large">
              <font-awesome-icon icon="book-open" class="fas fa-3x" />
            </span>
          </figure>
        </n-link>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>
              <n-link :to="`/pages/${id}`">{{ name }}</n-link>
            </strong>
            <span class="created-at">{{ formattedCreatedAt }}</span>
            <br />
            <span class="content-text">{{ strippedText }}</span>
          </p>
        </div>

        <div v-if="userAccountId" class="level is-mobile">
          <div class="level-left">
            <figure class="image is-32x32 level-item">
              <n-link :to="'/users/' + userAccountId">
                <img v-if="userImage" :src="userImage" :alt="userAccountId" />
                <span v-else class="icon is-medium">
                  <font-awesome-icon icon="user" class="fas fa-lg" />
                </span>
              </n-link>
            </figure>
            <p class="level-item page-created-by">
              By {{ userName }} @{{ userAccountId }}
            </p>
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
  @Prop({ default: '' }) readonly image!: string
  @Prop({ default: '' }) readonly createdAt!: string
  @Prop({ default: '' }) readonly userName!: string
  @Prop({ default: '' }) readonly userAccountId!: string
  @Prop({ default: '' }) readonly userImage!: string

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

.content-text {
  font-size: 0.9rem;
}

.page-created-by {
  font-size: 0.8rem;
}

.created-at {
  font-size: 0.75rem;
}
</style>
