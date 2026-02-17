import type { LayoutLib } from 'delta-comic-plugin-layout'

export const pluginName = 'cosav'

import { declareDepType } from '@delta-comic/plugin'

export const layoutModule = declareDepType<LayoutLib>('layout')