<script setup lang="ts">
import { LikeOutlined } from '@vicons/antd'
import { AccessTimeRound, DrawOutlined } from '@vicons/material'
import { Comp, coreModule, requireDepend, uni, Utils } from 'delta-comic-core'
import { isEmpty } from 'es-toolkit/compat'
import { StyleValue } from 'vue'
const $props = defineProps<{
  item: uni.item.Item
  freeHeight?: boolean
  disabled?: boolean
  type?: 'default' | 'big' | 'small'
  class?: any
  style?: StyleValue
}>()
const $emit = defineEmits<{ click: [item: uni.item.Item] }>()

const {
  comp: { ItemCard }
} = requireDepend(coreModule)
</script>

<template>
  <ItemCard :="$props" @click="$emit('click', item)">
    <template #smallTopInfo>
      <span v-if="item.viewNumber">
        <VanIcon name="eye-o" class="mr-0.5" size="14px" />
        <span>{{ item.viewNumber }}</span>
      </span>
      <span v-if="item.likeNumber">
        <NIcon class="mr-0.5" size="14px" color="white">
          <LikeOutlined />
        </NIcon>
        <span>{{ item.likeNumber }}</span>
      </span>
      <span class="absolute right-1 text-xs">
        {{ item.length }}
      </span>
    </template>
    <div class="flex items-center gap-0.5" v-if="item.author.length && type == 'small'">
      <NIcon color="var(--van-text-color-2)" size="14px">
        <DrawOutlined />
      </NIcon>
      <span class="van-ellipsis ml-0.5 w-2/3 text-xs text-(--van-text-color-2)">
        {{ item.author[0].label }}
        <template v-if="item.author.length > 1"> 等联合创作 </template>
      </span>
    </div>
    <template v-if="type != 'small'">
      <div class="flex gap-0.5 **:text-nowrap">
        <VanTag type="primary" plain v-for="category of item.categories">{{
          category.name
        }}</VanTag>
      </div>
      <div
        class="van-ellipsis mt-0.5 flex flex-nowrap items-center *:text-nowrap"
        v-if="item.$updateTime.get('year') != 1970"
      >
        <NIcon color="var(--van-text-color-2)" size="14px">
          <AccessTimeRound />
        </NIcon>
        <span class="mr-2">{{ Utils.translate.createDateString(item.$updateTime) }}</span>
      </div>
      <div
        class="van-ellipsis flex flex-nowrap items-center *:text-nowrap"
        v-if="item.author.length"
      >
        <NIcon color="var(--van-text-color-2)" size="14px">
          <DrawOutlined />
        </NIcon>
        <span v-for="author of item.author" class="mr-2">{{ author.label }}</span>
      </div>
    </template>
    <template #cover>
      <span class="absolute right-1 bottom-1 rounded bg-black/70 px-1 text-[10px] text-white">
        {{ item.length }}
      </span>
    </template>
  </ItemCard>
</template>