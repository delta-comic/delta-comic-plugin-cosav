import '@/index.css'
import { UserOutlined } from '@vicons/antd'
import { SearchOutlined } from '@vicons/material'
import axios, { formToJSON } from 'axios'
import { AES, MD5, enc, mode, pad } from 'crypto-js'
import {
  definePlugin,
  requireDepend,
  uni,
  Utils,
  type PluginConfigSearchTabbar,
  type PluginConfigSubscribe
} from 'delta-comic-core'
import { first, inRange, isEmpty, isString } from 'es-toolkit/compat'

import { cosav } from './api'
import { Building } from './api/api/icons'
import { api, image } from './api/forks'
import { CosavComicPage, CosavVideoPage } from './api/page'
import Card from './components/card.vue'
import ComicCard from './components/comicCard.vue'
import Tabbar from './components/tabbar.vue'
import { cosavStore } from './store'
import { layoutModule, pluginName } from './symbol'
const testAxios = axios.create({
  timeout: 10000,
  method: 'GET',
  validateStatus(status) {
    return inRange(status, 199, 499)
  }
})
const { layout } = requireDepend(layoutModule)
testAxios.interceptors.response.use(
  undefined,
  Utils.request.utilInterceptors.createAutoRetry(testAxios, 2)
)
void definePlugin({
  name: pluginName,
  api: {
    api: {
      forks: () => Promise.resolve(api),
      test: (fork, signal) => testAxios.get(`${fork}/promote_list`, { signal })
    }
  },
  resource: {
    types: [
      {
        type: 'default',
        test: async (url, signal) => {
          const body = await fetch(`${url}/videos/tmb/30859/0.jpg`, { signal })
          if (!body.ok) throw new Error('fail to connect')
        },
        urls: image
      }
    ]
  },
  onBooted: ins => {
    console.log('setup...', ins, ins.api?.api)
    if (ins.api?.api) {
      const f = ins.api.api
      const api = Utils.request.createAxios(
        () => f,
        {},
        ins => {
          const cosKey = 'CosAppMakeBigMoneyCosplayAPPContent'
          const key = MD5(cosKey).toString()
          const keyHex = enc.Utf8.parse(key)
          ins.interceptors.request.use(async requestConfig => {
            const key = Date.now().toString()
            const tokenParam = `CosAppMakeBigMoney,${Math.floor(Date.now() / 1000)}`
            requestConfig.cosav_key = key
            requestConfig.headers.set('User-Params', '')
            requestConfig.headers.set('Tokenparam', tokenParam)
            requestConfig.headers.set('Use-interface', requestConfig.baseURL)
            return requestConfig
          })
          ins.interceptors.response.use(res => {
            const decrypt = (cipherText: string) => {
              const dData = AES.decrypt(cipherText, keyHex, { mode: mode.ECB, padding: pad.Pkcs7 })
              const result = dData.toString(enc.Utf8)
              return JSON.parse(result)
            }
            if (!res.data.data) return res
            if (isString(res.data)) {
              res.data = JSON.parse(res.data.replace(/}\[.+/gims, '}'))
            }
            if (isString(res.data.data)) res.data = decrypt(res.data.data)
            const data =
              res.config.data instanceof FormData ? formToJSON(res.config.data) : res.config.data
            console.log('response', res.config.url, data ?? res.config.params ?? {}, '->', res.data)
            return res
          })
          return ins
        }
      )
      cosavStore.api.value = api
      Utils.eventBus.SharedFunction.define(
        s => cosav.api.search.getRandomVideo(s),
        pluginName,
        'getRandomProvide'
      )
      Utils.eventBus.SharedFunction.define(
        s => cosav.api.search.getRandomComic(s),
        pluginName,
        'getRandomProvide'
      )
      return { api, cosav }
    }
  },
  content: {
    [CosavVideoPage.contentType]: {
      contentPage: CosavVideoPage,
      itemCard: Card,
      layout: layout.Default,
      itemTranslator: raw => new cosav.video.CosavVideo(raw)
    },
    [CosavComicPage.contentType]: {
      contentPage: CosavComicPage,
      itemCard: ComicCard,
      layout: layout.Default,
      itemTranslator: raw => new cosav.comic.CosavComic(raw)
    }
  },
  otherProgress: [
    {
      name: '预加载数据',
      async call(setDescription) {
        setDescription('获取分类 & 推荐等...')
        try {
          const [settings, categories] = await Promise.all([
            cosav.api.search.getSettings(),
            cosav.api.search.getVideoCategories()
          ])
          cosavStore.settings.value = settings
          for (const page of settings.$index_page) {
            uni.content.ContentPage.addMainList(pluginName, {
              content: () => Utils.data.PromiseContent.resolve(page.list),
              name: page.name,
              onClick() {
                return Utils.eventBus.SharedFunction.call('routeToSearch', '')
              }
            })
          }
          cosavStore.categories.value = categories
          uni.content.ContentPage.addTabbar(
            pluginName,
            ...categories.map(
              v => <PluginConfigSearchTabbar>{ comp: Tabbar, id: v.CHID, title: v.name }
            )
          )
          setDescription('成功')
        } catch (error) {
          setDescription('失败')
          throw error
        }
      }
    }
  ],
  search: {
    methods: {
      keyword: {
        name: '视频',
        getStream(input, sort) {
          return cosav.api.search.utils.video.createKeywordStream(input, <cosav.SortType>sort)
        },
        sorts: cosav.sortMap,
        defaultSort: '',
        async getAutoComplete(input, signal) {
          return (
            await cosav.api.search.utils.video.byKeyword(input, undefined, undefined, signal)
          ).list.map(v => ({ text: v.title, value: v.title }))
        }
      },
      cos: {
        name: '图集',
        getStream(input, sort) {
          return cosav.api.search.utils.comic.createKeywordStream(input, <cosav.SortType>sort)
        },
        sorts: cosav.sortMap,
        defaultSort: '',
        async getAutoComplete(input, signal) {
          return (
            await cosav.api.search.utils.comic.byKeyword(input, undefined, undefined, signal)
          ).list.map(v => ({ text: v.title, value: v.title }))
        }
      }
    },
    hotPage: { levelBoard: cosav.api.search.getLevelboard() }
  },
  user: {
    authorActions: {
      search_comic: {
        name: '搜索该coser',
        call(author) {
          return Utils.eventBus.SharedFunction.call('routeToSearch', author.label, [
            pluginName,
            'cos'
          ])
        },
        icon: SearchOutlined
      },
      search_video: {
        name: '搜索',
        call(author) {
          return Utils.eventBus.SharedFunction.call('routeToSearch', author.label, [
            pluginName,
            'keyword'
          ])
        },
        icon: SearchOutlined
      }
    },
    authorIcon: { user: UserOutlined, cpy: Building }
  },
  subscribe: {
    keyword: {
      getListStream: author =>
        Utils.data.Stream.create<uni.item.Item>(async function* (signal, that) {
          const video = cosav.api.search.utils.video.createKeywordStream(author.label, 'mr')
          const comic = cosav.api.search.utils.comic.createKeywordStream(author.label, 'mr')
          signal.addEventListener('abort', () => {
            comic.stop()
            video.stop()
          })
          while (true) {
            const news = new Array<uni.item.Item>()
            const [vRes, cRes] = await Promise.all([
              video._isDone ? { value: [] } : video.next(),
              comic._isDone ? { value: [] } : comic.next()
            ])
            news.push(...(vRes?.value ?? []))
            news.push(...(cRes?.value ?? []))
            that.pages.value = Math.max(video._pages, comic._pages)
            that.page.value = Math.max(video._page, comic._page)
            that.total.value = video._total + comic._total
            yield news
            if (video._isDone && comic._isDone) return
          }
        }),
      getUpdateList(olds, signal) {
        return diff(this, olds, signal)
      }
    }
  }
})

const diff = async (
  that: PluginConfigSubscribe,
  olds: Parameters<PluginConfigSubscribe['getUpdateList']>[0],
  signal?: AbortSignal
) => {
  const allList = await Promise.all(
    olds.map(async v => {
      const stream = that.getListStream(v.author)
      signal?.addEventListener('abort', () => stream.stop())
      const news = (await stream.next()).value
      if (!news) throw new Error(`[subscribe] ${v.author.label} is void!`)
      return { author: v.author, list: news }
    })
  )
  const changedAuthors = new Array<uni.item.Author>()
  for (const item of allList) {
    const key = item.author.label
    const old = olds.find(o => o.author.label === key)

    const newFirst = first(item.list)
    const oldFirst = first(old?.list)

    let changed = false
    if (oldFirst && newFirst) changed = newFirst.id !== oldFirst.id
    else changed = true
    if (changed) changedAuthors.push(item.author)
  }

  return { isUpdated: isEmpty(changedAuthors), whichUpdated: changedAuthors }
}