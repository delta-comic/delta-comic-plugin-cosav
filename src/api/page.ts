import { Stream, uni } from '@delta-comic/model'
import { require } from '@delta-comic/plugin'
import { until } from '@vueuse/core'

import { layoutModule, pluginName } from '@/symbol'

import { cosav } from '.'
import { createCommonComicToItem, createCommonVideoToItem } from './api/utils'
const {
  view,
  model: { ContentImagePage, ContentVideoPage }
} = require(layoutModule)
export class CosavVideoPage extends ContentVideoPage {
  public static contentType = uni.content.ContentPage.contentPage.toString([pluginName, 'video'])
  override contentType = uni.content.ContentPage.contentPage.toJSON(CosavVideoPage.contentType)
  override comments = Stream.create<uni.comment.Comment>(function* () {
    return
  })
  override loadAll(signal?: AbortSignal): Promise<any> {
    this.pid.resolve(`cv${this.ep}`)
    return Promise.all([
      this.eps.content.isLoading.value || this.eps.content.loadPromise(this.loadEps(signal)),
      this.detail.content.isLoading.value ||
        this.detail.content.loadPromise(
          cosav.api.video.getInfo(this.ep, signal).then((v: cosav.video.CosavVideo) => {
            const raw = <cosav.video.RawFullVideo>v.$$meta.raw
            this.recommends.resolve(raw.cnxh.map(createCommonVideoToItem))
            this.videos.resolve(
              raw.video_url_vip
                .concat(raw.video_url)
                .map(v => ({ src: v, type: 'application/vnd.apple.mpegurl' }))
                .toReversed()
            )
            return v
          })
        )
    ])
  }
  public async loadEps(signal?: AbortSignal) {
    await until(this.union).toBeTruthy()
    const video = <cosav.video.CosavVideo>this.union.value
    if (video.$$meta.raw.group_id == '0') return [video.$thisEp]
    const info = await cosav.api.search.utils.video.byGroupId(
      video.$$meta.raw.group_id,
      undefined,
      undefined,
      signal
    )
    return info.list.map(v => {
      const raw = v.$$meta.raw as cosav.video.RawCommonVideo
      return new uni.ep.Ep({ $$plugin: pluginName, index: raw.id, name: v.title })
    })
  }
  override reloadAll(signal?: AbortSignal) {
    this.pid.reset(true)
    this.eps.reset(true)
    this.videos.reset(true)
    this.detail.reset(true)
    this.recommends.reset(true)
    return this.loadAll(signal)
  }
  override plugin = pluginName
  override loadAllOffline(_save: any): Promise<never> {
    throw new Error('Method not implemented.')
  }
  override exportOffline(): Promise<never> {
    throw new Error('Method not implemented.')
  }
  override ViewComp = view.Video as any
}

export class CosavComicPage extends ContentImagePage {
  public static contentType = uni.content.ContentPage.contentPage.toString([pluginName, 'comic'])
  override contentType = uni.content.ContentPage.contentPage.toJSON(CosavVideoPage.contentType)
  override comments = Stream.create<uni.comment.Comment>(function* () {
    return
  })
  override loadAll(signal?: AbortSignal) {
    this.pid.resolve(`c1${this.ep}`)
    return Promise.all([
      this.detail.content.isLoading.value ||
        this.detail.content.loadPromise(
          cosav.api.comic.getInfo(this.ep, signal).then(v => {
            const raw = v.$$meta.raw as cosav.comic.RawFullComic
            this.recommends.resolve(raw.related?.map(createCommonComicToItem) ?? [])
            return v
          })
        ),
      this.images.content.isLoading.value ||
        this.images.content.loadPromise(cosav.api.comic.getPages(this.ep, signal))
    ])
  }
  override reloadAll(signal?: AbortSignal) {
    this.pid.reset(true)
    this.images.reset(true)
    this.detail.reset(true)
    this.recommends.reset(true)
    return this.loadAll(signal)
  }
  override plugin = pluginName
  override loadAllOffline(_save: any): Promise<never> {
    throw new Error('Method not implemented.')
  }
  override exportOffline(): Promise<never> {
    throw new Error('Method not implemented.')
  }
  override ViewComp = view.Image as any
}
