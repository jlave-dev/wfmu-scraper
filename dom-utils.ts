import axios from 'axios'
import { JSDOM } from 'jsdom'
import config from './config'

async function getHtml(url: string): Promise<string> {
  const res = await axios.get(url)
  return res.data
}

function getDocumentFromHtml(html: string): Document {
  const { document } = (new JSDOM(html)).window
  return document
}

async function getDocumentFromPath(path: string): Promise<Document> {
  const url = `${config.BASE_URL}${path}`
  const html = await getHtml(url)
  const document = getDocumentFromHtml(html)
  return document
}

export default {
  getHtml,
  getDocumentFromHtml,
  getDocumentFromPath,
}