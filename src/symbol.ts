import { declareDependType } from "delta-comic-core"
import type { LayoutPlugin } from "delta-comic-plugin-layout"

export const pluginName = 'cosav'

export const layoutModule = declareDependType<LayoutPlugin>('layout')