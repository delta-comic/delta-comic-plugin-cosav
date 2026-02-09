import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function setVersion(version: string) {
  const path = join(import.meta.dirname, '../package.json')
  const pkg: typeof import('../package.json') = JSON.parse(
    await readFile(path, { encoding: 'utf-8' })
  )
  pkg.version = version
  await writeFile(path, JSON.stringify(pkg, null, 2), { encoding: 'utf-8' })
}

const version = process.argv[2]
if (version) await setVersion(version)