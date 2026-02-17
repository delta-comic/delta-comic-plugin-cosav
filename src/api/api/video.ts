import { PromiseContent } from '@delta-comic/model'

import { cosavStore } from '@/store'

import type { cosav } from '..'

import { createFullVideoToItem } from './utils'

export namespace _cosavApiVideo {
  export const getInfo = PromiseContent.fromAsyncFunction((id: string, signal?: AbortSignal) =>
    cosavStore.api
      .value!.get<cosav.video.RawFullVideo>('/video/videoinfo', { signal, params: { id } })
      .then<cosav.video.CosavVideo>(createFullVideoToItem)
  )
}