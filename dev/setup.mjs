#!./node_modules/zx/build/cli.js

import { $, fs } from 'zx';

const writeTestSettings = process.argv[3]
const username = await $`whoami`
const password = Math.random().toString(36).slice(-8)
const settings = [
  `DB_USERNAME=${username.toString().trim()}`,
  `DB_PASSWORD=${password}`,
  `DB_NAME=dev`,
  `BLOG_BASE_URL=https://test.xyz`,
  'DB_HOST=127.0.0.1'
].join('\n')
const test_settings= [
  `DB_USERNAME=test`,
  `DB_PASSWORD=test`,
  `DB_NAME=test`,
  `BLOG_BASE_URL=https://test.xyz`,
  'DB_HOST=postgres'
].join('\n')

if(writeTestSettings == '--test') {
  await fs.writeFile('.env', test_settings);
}
else {
  await fs.writeFile('.env', settings);
  await fs.writeFile('.env.test', test_settings);
}

