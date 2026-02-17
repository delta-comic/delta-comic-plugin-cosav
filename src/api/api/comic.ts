import { PromiseContent, uni } from '@delta-comic/model'

import { cosavStore } from '@/store'
import { pluginName } from '@/symbol'

import type { cosav } from '..'

import { createFullComicToItem } from './utils'

export namespace _cosavApiComic {
  export const getInfo = PromiseContent.fromAsyncFunction((id: string, signal?: AbortSignal) =>
    cosavStore.api
      .value!.get<cosav.comic.RawFullComic>('/albums/albuminfo', { signal, params: { id } })
      .then<cosav.comic.CosavComic>(createFullComicToItem)
  )

  export const getPages = PromiseContent.fromAsyncFunction((id: string, signal?: AbortSignal) =>
    cosavStore.api
      .value!.get<{ latest: string[] }>('/albums/album_content', {
        signal,
        params: { id, limit: 999 }
      })
      .then<uni.image.Image[]>(v =>
        v.latest.map(v =>
          uni.image.Image.create({
            $$plugin: pluginName,
            type: 'default',
            pathname: new URL(v).pathname.replaceAll('/media', '')
          })
        )
      )
  )
}