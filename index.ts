import WfmuScraper from './wfmu-scraper'

async function main(): Promise<void> {
  const wfmuScraper = new WfmuScraper('HG')
  wfmuScraper.on('ready', (scraper) => {
    console.log(scraper.shows)
  })
}

main()