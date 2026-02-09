import type { Style } from '@capacitor/status-bar'
import type { Router } from 'vue-router'

import { type useMessage, type useLoadingBar, type useDialog } from 'naive-ui'
import { Component } from 'vue'

import { ExternalLibKey } from '../external'
import { uni } from './struct'
import { Utils } from './utils'
declare global {
  interface Window {
    $message: ReturnType<typeof useMessage>
    $loading: ReturnType<typeof useLoadingBar>
    $dialog: ReturnType<typeof useDialog>
    $api: Record<string, any>
    $$lib$$: Record<ExternalLibKey[keyof ExternalLibKey], any>
    $$safe$$: boolean
    $router: Router
    $layout: Record<string, uni.content.ViewLayoutComp>
    $view: Record<string, uni.content.ViewComp>
    $comp: {
      Comment: Component<{ item: uni.item.Item; comments: Utils.data.RStream<uni.comment.Comment> }>
    }
    $isDev: boolean
  }
}
declare module 'axios' {
  interface AxiosRequestConfig {
    __retryCount?: number
    disretry?: boolean
    allowEmpty?: boolean
    cosav_key?: string
  }
}

export declare module 'vue-router' {
  interface Router {
    force: { push: Router['push']; replace: Router['replace'] }
  }
  interface RouteMeta {
    statusBar?: { overlaysWebView?: boolean; style?: Style; backgroundColor?: string }
    force?: boolean
  }
}
export {}