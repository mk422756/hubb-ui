<template>
  <no-ssr>
    <croppa
      v-model="myCroppa"
      class="border"
      :width="200"
      :height="200"
      :canvas-color="'#fff'"
      :accept="'image/*'"
      :placeholder="'画像を選択してください'"
      :show-remove-button="true"
      :prevent-white-space="false"
      :initial-image="image"
      remove-button-color="black"
    />
  </no-ssr>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      myCroppa: {}
    }
  },

  methods: {
    getData() {
      return this.myCroppa.generateDataUrl('image/jpeg')
    }
  }
}
</script>
