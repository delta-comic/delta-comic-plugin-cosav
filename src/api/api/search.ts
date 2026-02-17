import type { Search } from '@delta-comic/plugin'

import { PromiseContent } from '@delta-comic/model'
import { random } from 'es-toolkit/compat'

import { cosavStore } from '@/store'

import type { cosav, cosav as CosavType } from '..'
import type { _cosavComic } from '../comic'
import type { _cosavVideo } from '../video'

import { _cosavSearch } from '../search'
import { cosavStream, createCommonComicToItem, createCommonVideoToItem } from './utils'

export namespace _cosavApiSearch.utils.video {
  export const union = PromiseContent.fromAsyncFunction(
    async (
      params: Record<string, string>,
      page: number = 0,
      order: CosavType.SortType = '',
      signal?: AbortSignal
    ) => {
      const result = await cosavStore.api.value!.get<
        CosavType.RawStream<_cosavVideo.RawCommonVideo>
      >(`/video/lists`, {
        params: { page, limit: 30, order: order == '' ? undefined : order, ...params },
        signal
      })
      return { ...result, list: result.list.map(createCommonVideoToItem) }
    }
  )

  export const byKeyword = (
    keyword: string,
    page: number = 0,
    sort: cosav.SortType = '',
    signal?: AbortSignal
  ) => union({ kw: keyword }, page, sort, signal)
  export const createKeywordStream = (keyword: string, sort: cosav.SortType = '') =>
    cosavStream((page, signal) => byKeyword(keyword, page, sort, signal))

  export const byCategory = (
    category: string,
    page: number = 0,
    sort: cosav.SortType = '',
    signal?: AbortSignal
  ) => union({ ct: category }, page, sort, signal)
  export const createCategoryStream = (category: string, sort: cosav.SortType = '') =>
    cosavStream((page, signal) => byCategory(category, page, sort, signal))

  export const byGroupId = (
    groupId: string,
    page: number = 0,
    sort: cosav.SortType = '',
    signal?: AbortSignal
  ) => union({ group_id: groupId }, page, sort, signal)
  export const createGroupIdStream = (groupId: string, sort: cosav.SortType = '') =>
    cosavStream((page, signal) => byGroupId(groupId, page, sort, signal))
}
export namespace _cosavApiSearch.utils.comic {
  export const union = PromiseContent.fromAsyncFunction(
    async (
      params: Record<string, string>,
      page: number = 1,
      sort: cosav.SortType = '',
      signal?: AbortSignal
    ) => {
      const result = await cosavStore.api.value!.get<
        CosavType.RawStream<_cosavComic.RawCommonComic>
      >(`/albums/lists`, {
        params: { page, order: sort == '' ? undefined : sort, limit: 30, ...params },
        signal
      })
      return { ...result, list: result.list.map(createCommonComicToItem) }
    }
  )

  export const byKeyword = (
    keyword: string,
    page: number = 0,
    sort: cosav.SortType = '',
    signal?: AbortSignal
  ) => union({ kw: keyword }, page, sort, signal)
  export const createKeywordStream = (keyword: string, sort: cosav.SortType = '') =>
    cosavStream((page, signal) => byKeyword(keyword, page, sort, signal))
}

export namespace _cosavApiSearch {
  export const getVideoRecommend = PromiseContent.fromAsyncFunction((signal?: AbortSignal) =>
    cosavStore.api
      .value!.get<_cosavVideo.RawCommonVideo[]>('/video/recommend', { signal })
      .then<cosav.video.CosavVideo[]>(v => v.map(createCommonVideoToItem))
  )

  export const getVideoCategories = PromiseContent.fromAsyncFunction((signal?: AbortSignal) =>
    cosavStore.api.value!.get<_cosavSearch.CategoriesItem[]>('/video/categories', { signal })
  )
  export const getVideoCategoriesSub = PromiseContent.fromAsyncFunction(
    (ct: string, signal?: AbortSignal) =>
      cosavStore.api.value!.get<_cosavSearch.CategoriesSubItem[]>(`/video/categories_sub`, {
        signal,
        params: { ct }
      })
  )

  export const getHotVideo = (page: number = 0, signal?: AbortSignal) =>
    _cosavApiSearch.utils.video.union({}, page, 'mv', signal)
  export const createVideoHotStream = () => cosavStream((page, signal) => getHotVideo(page, signal))

  const cRandom = () => {
    const f = random(0, 100)
    return f > 40 ? random(0, 100) : f
  }
  export const getRandomVideo = (signal?: AbortSignal) =>
    _cosavApiSearch.utils.video.union({}, cRandom(), '', signal).then(v => v.list)

  export const getRandomComic = (signal?: AbortSignal) =>
    _cosavApiSearch.utils.comic.union({}, cRandom(), '', signal).then(v => v.list)

  export const getSettings = PromiseContent.fromAsyncFunction((signal?: AbortSignal) =>
    cosavStore.api
      .value!.get<_cosavSearch.RawSettings>('/site/setting', { signal })
      .then<_cosavSearch.Settings>(setting => new _cosavSearch.Settings(setting))
  )

  export const getLevelboard = () =>
    [
      {
        name: '视频:总排行',
        content: () =>
          _cosavApiSearch.utils.video.byKeyword('', undefined, 'mv').setProcessor(v => v.list)
      },
      {
        name: '图集:总排行',
        content: () =>
          _cosavApiSearch.utils.comic.byKeyword('', undefined, 'mv').setProcessor(v => v.list)
      }
    ] satisfies Search.HotLevelboard[]
}