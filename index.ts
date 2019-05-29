import dotenv from 'dotenv'
dotenv.config()

import WfmuScraper from './wfmu-scraper'

async function main(): Promise<void> {
  const wfmuScraper = new WfmuScraper()
  await wfmuScraper.scrapeAll()
}

main()