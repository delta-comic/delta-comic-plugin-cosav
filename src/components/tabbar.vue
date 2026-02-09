<script setup lang="ts">
import { cosav } from '@/api'
import { useResizeObserver, until } from '@vueuse/core'
import { Comp, PluginConfigSearchTabbar, Store, Utils } from 'delta-comic-core'
import { isEmpty } from 'es-toolkit/compat'
import { computed, onMounted, ref, shallowRef } from 'vue'
import { ComponentExposed } from 'vue-component-type-helpers'
import { useRouter } from 'vue-router'
const $props = defineProps<{ isActive: boolean; tabbar: PluginConfigSearchTabbar }>()
const $router = useRouter()

const list = shallowRef<ComponentExposed<typeof Comp.Waterfall>>()
const temp = Store.useTemp()
const orderScrollSaveTemp = temp.$applyRaw(`orderCosavScoreSave`, () => new Map<string, number>())
const containBound = ref<DOMRectReadOnly>()
useResizeObserver(
  () => <HTMLDivElement | null>list.value?.scrollParent?.firstElementChild,
  ([b]) => (containBound.value = b.contentRect)
)
onMounted(async () => {
  if (!isEmpty(subSource.value.data.value)) {
    await until(() => (containBound.value?.height ?? 0) > 8).toBeTruthy()
    list.value?.scrollParent?.scroll(0, orderScrollSaveTemp.get($props.tabbar.id) ?? 0)
  }
})
const stop = $router.beforeEach(() => {
  stop()
  orderScrollSaveTemp.set($props.tabbar.id, list.value?.scrollTop ?? 0)
})

const subCategoriesTemp = temp.$applyRaw(
  `orderVideoSubCategoriesTemp`,
  () => new Map<string, Utils.data.PromiseContent<cosav.search.CategoriesSubItem[]>>()
)
const subCategories = computed(() => {
  if (!subCategoriesTemp.has($props.tabbar.id))
    subCategoriesTemp.set(
      $props.tabbar.id,
      cosav.api.search.getVideoCategoriesSub($props.tabbar.id)
    )
  return subCategoriesTemp.get($props.tabbar.id)!
})

const selectTabId = shallowRef($props.tabbar.id)
const subCategoriesStreamTemp = temp.$applyRaw(
  `orderVideoSubCategoriesStreamTemp`,
  () => new Map<string, Utils.data.RStream<cosav.video.CosavVideo>>()
)
const subSource = computed(() => {
  if (!subCategoriesStreamTemp.has(selectTabId.value))
    subCategoriesStreamTemp.set(
      selectTabId.value,
      cosav.api.search.utils.video.createCategoryStream(selectTabId.value)
    )
  return subCategoriesStreamTemp.get(selectTabId.value)!
})
</script>

<template>
  <Comp.Content :source="subCategories" ref="list" class="!size-full">
    <Comp.Var
      :value="[
        { name: '全部', id: $props.tabbar.id },
        ...(subCategories.data.value?.map(v => ({ name: v.name, id: v.CHID })) ?? [])
      ]"
      v-slot="{ value }"
    >
      <VanTabs v-model:active="selectTabId" class="size-full *:last:size-full">
        <VanTab v-for="sub of value" :title="sub.name" :name="sub.id" class="size-full">
          <Comp.Waterfall :source="subSource" class="h-[calc(100%-45px)] w-full" v-slot="{ item }">
            <Card :item free-height type="small" />
          </Comp.Waterfall>
        </VanTab>
      </VanTabs>
    </Comp.Var>
  </Comp.Content>
</template>