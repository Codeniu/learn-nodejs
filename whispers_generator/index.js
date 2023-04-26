import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import moment from 'moment/moment.js'

import { generate } from './lib/generator.js'
import { createRandomPicker } from './lib/random.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadCorpus(src) {
  const path = resolve(__dirname, src)
  const data = readFileSync(path, { encoding: 'utf-8' })
  return JSON.parse(data)
}

function saveCorpus(title, article) {
  const outputDir = resolve(__dirname, 'output')
  const time = moment().format('YYYY-MM-DD HHmmss')
  const outputFile = resolve(outputDir, `${title}${time}.txt`)

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir)
  }

  const text = `${title}\n\n    ${article.join('\n    ')}`
  writeFileSync(outputFile, text)

  return outputFile
}

const corpus = loadCorpus('corpus/data.json')

const pickTitle = createRandomPicker(corpus.title)
const title = pickTitle()

const article = generate(title, { corpus, min: 200, max: 300 })
// console.log(`${title}\n\n    ${article.join('\n    ')}`)

saveCorpus(title, article)
