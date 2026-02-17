import { uni } from '@delta-comic/model'

export namespace _cosavComic {
  export interface RawCommonComic {
    id: string
    title: string
    tags: string
    photo: string
    ct: string
    cos_works: string
    cos_role: string
    author: string
    total_photos: string
    total_views: string
    addtime: string
    adddate: string
    type: string
    album_desc?: string
    username?: string
    uid: string
  }

  export interface RawFullComic {
    adddate: string
    addtime: string
    album_desc?: string
    author: string
    cos_role: string
    cos_works: string
    ct: string
    ct_name: string
    dislikes: string
    id: string
    likes: string
    rate_view: string
    tags: string[]
    title: string
    total_photos: string
    total_views: string
    type: string
    uid: string
    user_avatar: string
    username: string
    related?: RawCommonComic[]
  }

  export class CosavComic extends uni.item.Item {
    override $$meta: { raw: RawFullComic | RawCommonComic }
    override like(_signal?: AbortSignal): PromiseLike<boolean> {
      window.$message.info('该内容无法点赞')
      throw new Error('Method not implemented.')
    }
    override report(_signal?: AbortSignal): PromiseLike<any> {
      window.$message.info('该内容无法举报')
      throw new Error('Method not implemented.')
    }
    override sendComment(_text: string, _signal?: AbortSignal): PromiseLike<any> {
      window.$message.info('该内容无法发送评论')
      throw new Error('Method not implemented.')
    }
    constructor(v: uni.item.RawItem) {
      super(v)
      this.$$meta = <any>v.$$meta
    }
  }
}