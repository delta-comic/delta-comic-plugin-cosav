import type { Utils } from 'delta-comic-core'

import { shallowRef } from 'vue'

import type { cosav } from '@/api'
export namespace cosavStore {
  export const api = shallowRef<Utils.request.Requester>()
  export const settings = shallowRef<cosav.search.Settings>()
  export const categories = shallowRef<cosav.search.CategoriesItem[]>([])
}
window.$api.cosavStore = cosavStore