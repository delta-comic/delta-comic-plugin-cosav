import pkg from './package.json' with { type: 'json' }
/** @type {import("semantic-release").GlobalConfig} */
export default {
  branches: ['main'],
  repositoryUrl: pkg.repository.url,
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ],
  tagFormat: '${version}'
}