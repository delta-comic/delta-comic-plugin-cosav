import { uni } from 'delta-comic-core'

export namespace _cosavVideo {
  export interface RawBaseVideo {
    id: string
    photo: string
    title: string
    duration: string
    viewnumber: string
    is_vip: string
    in_top: string
    channel: string
    barcode: string // 番号
    single_sale: string // useless
    sale_point: string
    likes: string
    addtime: string
    adddate: string
    is_exclusive: boolean

    group_id: string

    author: string // 作者
    tags: string[] // 标签
    cos_works: string // 作品
    cos_role: string // cos角色
  }

  export interface RawCommonVideo extends RawBaseVideo {
    channel_name: string
    channel_bg_color: null
    group_order: string
  }

  export interface RawFullVideo extends RawBaseVideo {
    type: string
    addtimestamp: string
    dislikes: string
    like_rate: string
    is_vip_limited_time: string
    vip_limited_time_start: string
    username: string
    user_avatar: string
    company: string // 片商
    series: string
    thank_vendor_text: string
    thank_vendor_url: string
    video_url: string[]
    video_url_vip: string[]
    video_img: string
    can_play: boolean
    can_play_status: string
    can_play_msg: string
    comments: string
    cnxh: RawCommonVideo[] // 相关推送
  }

  export class CosavVideo extends uni.item.Item {
    override $$meta: { raw: RawFullVideo | RawCommonVideo }
    override like(signal?: AbortSignal): PromiseLike<boolean> {
      window.$message.info('该内容无法点赞')
      throw new Error('Method not implemented.')
    }
    override report(signal?: AbortSignal): PromiseLike<any> {
      throw new Error('Method not implemented.')
    }
    override sendComment(text: string, signal?: AbortSignal): PromiseLike<any> {
      window.$message.info('该内容无法发送评论')
      throw new Error('Method not implemented.')
    }
    constructor(v: uni.item.RawItem) {
      super(v)
      this.$$meta = <any>v.$$meta
    }
  }
}