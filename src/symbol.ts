import type { LayoutPlugin } from 'delta-comic-plugin-layout'

import { declareDependType } from 'delta-comic-core'

export const pluginName = 'cosav'

export const layoutModule = declareDependType<LayoutPlugin>('layout')