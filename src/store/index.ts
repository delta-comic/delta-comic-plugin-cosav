import type { Requester } from '@delta-comic/request'

import { shallowRef } from 'vue'

import type { cosav } from '@/api'
export namespace cosavStore {
  export const api = shallowRef<Requester>()
  export const settings = shallowRef<cosav.search.Settings>()
  export const categories = shallowRef<cosav.search.CategoriesItem[]>([])
}
window.$api.cosavStore = cosavStore