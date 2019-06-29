// references.d.ts
/**
 * Extends interfaces in Vue.js
 */

import Vue, { ComponentOptions } from 'vue'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    // This adds the `middleware` property to the existing `vue/types/options/ComponentOptions` type
    apollo?: string | any
  }
}
