import { Show, Song } from './interfaces'

function accuflashlink(s: any, a: any, v: any, c: any, t: any, d: any) {
  return `/flashplayer.php?version=${v}&show=${s}&archive=${a}${c ? '&starttime=' + c : ''}${d ? '&drop=' + d : ''}`
}

function getPastPlaylistUrlsFromDocument(document: Document): string[] {
  const playlistUrls = []
  const uls = document.getElementsByTagName('ul')
  for (const ul of uls) {
    const lis = ul.children
    for (const li of lis) {
      if (li.children.length === 1 && li.children[0].tagName === 'A') {
        if (li.children[0].getAttribute('href')) {
          playlistUrls.push(li.children[0].getAttribute('href'))
        }
      }
    }
  }
  return playlistUrls as string[]
}

function getShowsFromDocument(document: Document): Show[] {
  const shows: any[] = []
  const uls = document.getElementsByTagName('ul')
  for (const ul of uls) {
    const lis = ul.children
    for (const li of lis) {
      const { children } = li

      // Ignore fill-in shows, which only have 2 children
      if (children.length > 2) {
        const show: Show = {
          date: null,
          title: null,
          showUrl: null,
          streamUrl: null,
          playerUrl: null,
        }

        // Check for show date
        if (li && li.textContent) {
          const match = li.textContent.match(/(\w+\s\d+,\s\d+):?/)
          if (match && match[1]) {
            const date = new Date(match[1])
            if (date && date instanceof Date && !isNaN(date.getTime())) {
              show.date = date
            }
          }
        }

        for (const child of children) {
          if (child.textContent) {
            if (child.tagName === 'B') {
              show.title = child.textContent
            }

            if (child.tagName === 'A') {
              const href = child.getAttribute('href')
              if (href && href.includes('playlists')) {
                show.showUrl = href
              }
              if (href && href.includes('listen')) {
                show.streamUrl = href
              }
            }

            if (child.tagName === 'SCRIPT' && child.textContent.includes('accuflashlink')) {
              const playerUrl = eval(child.textContent)
              if (playerUrl) {
                show.playerUrl = playerUrl
              }
            }
          }
        }

        shows.push(show)
      }
    }
  }

  return shows
}

function getSongsFromDocument(document: Document): Song[] {
  return []
}

export default {
  getPastPlaylistUrlsFromDocument,
  getShowsFromDocument,
  getSongsFromDocument,
}