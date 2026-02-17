<script setup lang="ts">
import { layoutModule } from '@/symbol'
import type { uni } from '@delta-comic/model'
import { require } from '@delta-comic/plugin'
import { LikeOutlined } from '@vicons/antd'
import { AccessTimeRound, DrawOutlined } from '@vicons/material'
import { uniqBy } from 'es-toolkit'
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
  component: { ItemCard },
  helper: { createDateString }
} = require(layoutModule)
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
    </template>
    <div class="flex items-center gap-0.5" v-if="item.author.length && type == 'small'">
      <NIcon color="var(--van-text-color-2)" size="14px">
        <DrawOutlined />
      </NIcon>
      <span class="van-ellipsis ml-0.5 w-full text-xs text-(--van-text-color-2)">
        {{ item.author[0].label }}
        <template v-if="item.author.length > 1"> 等联合创作 </template>
      </span>
    </div>
    <template v-if="type != 'small'">
      <div class="flex gap-0.5 **:text-nowrap">
        <VanTag type="primary" plain v-for="category of uniqBy(item.categories, v => v.name)">{{
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
        <span class="mr-2">{{ createDateString(item.$updateTime) }}</span>
      </div>
      <div class="van-ellipsis flex flex-nowrap items-center *:text-nowrap">
        <NIcon color="var(--van-text-color-2)" size="14px">
          <DrawOutlined />
        </NIcon>
        <span v-for="author of item.author" class="mr-2">{{ author.label }}</span>
      </div>
    </template>
  </ItemCard>
</template>