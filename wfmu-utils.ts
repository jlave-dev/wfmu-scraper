import { Program, Show, Song } from './interfaces'

function accuflashlink(s: any, a: any, v: any, c: any, t: any, d: any) {
  return `/flashplayer.php?version=${v}&show=${s}&archive=${a}${c ? '&starttime=' + c : ''}${d ? '&drop=' + d : ''}`
}

function getProgramsFromDocument(document: Document): { [id: string]: Program } {
  const programs: { [id: string]: Program } = {}
  const programLinks = document.getElementsByClassName('show-title-link')
  for (const programLink of programLinks) {
    const program: Program = {
      id: null,
      title: null,
    }
    const href = programLink.getAttribute('href')
    if (href) {
      const splitHref = href.split('/')
      const id = href.match(/[A-Z]{2}/)
      if (id && id.length) {
        program.id = id[0].trim()
      }
    }
    const programTitle = programLink.textContent
    if (programTitle) {
      program.title = programTitle.trim()
    }
    // Index by ID to avoid duplicates
    if (program.id && !programs[program.id]) {
      programs[program.id] = program
    }
  }
  return programs
}

function getPastPlaylistUrlsFromDocument(document: Document): string[] {
  const playlistUrls = []
  const uls = document.getElementsByTagName('ul')
  for (const ul of uls) {
    const lis = ul.children
    for (const li of lis) {
      if (li.children.length === 1 && li.children[0].tagName === 'A') {
        const href = li.children[0].getAttribute('href')
        if (href) {
          playlistUrls.push(href.trim())
        }
      }
    }
  }
  return playlistUrls as string[]
}

function getShowsFromDocument(document: Document, programId: string): { [id: string]: Show } {
  const shows: { [id: string]: Show } = {}
  const uls = document.getElementsByTagName('ul')
  for (const ul of uls) {
    const lis = ul.children
    for (const li of lis) {
      const { children } = li

      // Ignore fill-in shows, which only have 2 children
      if (children.length > 2) {
        const show: Show = {
          programId,
          id: null,
          date: null,
          title: null,
          showPath: null,
          streamPath: null,
          playerPath: null,
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
              show.title = child.textContent.trim()
            }

            if (child.tagName === 'A') {
              const href = child.getAttribute('href')
              if (href && href.includes('playlists')) {
                show.showPath = href.trim()
                const showId = href.match(/\d+/)
                if (showId && showId.length) {
                  show.id = showId[0].trim()
                }
              }
              if (href && href.includes('listen')) {
                show.streamPath = href.trim()
              }
            }

            if (child.tagName === 'SCRIPT' && child.textContent.includes('accuflashlink')) {
              const playerPath = eval(child.textContent)
              if (playerPath) {
                show.playerPath = playerPath.trim()
              }
            }
          }
        }

        // Index by ID to avoid duplicates
        if (show.id && !shows[show.id]) {
          shows[show.id] = show
        }
      }
    }
  }

  return shows
}

function getSongsFromDocument(document: Document, showId: string): { [id: string]: Song } {
  const headersDictionary: any = {
    'Artist': 'artist',
    'THE STOOGE': 'artist',
    'Track': 'title',
    'THE SONG': 'title',
    'Album': 'album',
    'Label': 'label',
    'Format': 'format',
    'Year': 'year',
    'Images': 'image',
    'Comments': 'comments',
  }
  const songs: { [id: string]: Song } = {}
  const rows = document.getElementsByTagName('tr')
  let headers: string[] = []
  for (const row of rows) {
    // Ignore spacer rows with just one child
    if (row.children.length > 1) {
      const song: Song = {
        showId,
        id: null,
        artist: null,
        title: null,
        album: null,
        label: null,
        year: null,
        image: null,
        format: null,
        comments: null,
      }

      // Check for headers to accurately label columns
      if (row.children[0].tagName === 'TH') {
        headers = [...row.children].map(child => child.textContent as string)
      }

      if (headers.length) {
        [...row.children].forEach((child, i) => {
          if (child.tagName === 'TD' && child.className === 'song') {
            // Get song ID from span ID
            const songIdElements = child.getElementsByClassName('KDBsong')
            if (songIdElements.length) {
              const songIdMatch = songIdElements[0].id.match(/\d+/)
              if (songIdMatch && songIdMatch.length) {
                song.id = songIdMatch[0]
              }
            }

            const childHeader = headers[i]
            const normalizedHeader = headersDictionary[childHeader]
            if (childHeader && normalizedHeader) {
              if (child.textContent && child.textContent.trim()) {
                (song as any)[normalizedHeader] = child.textContent.trim()
              }

              if (normalizedHeader === 'image') {
                const images = child.getElementsByTagName('img')
                if (images.length) {
                  const image = images[0]
                  const src = image.getAttribute('src')
                  if (image && src) {
                    song.image = src.trim()
                  }
                }
              }
            }
          }
        })
      }

      // Index by ID to avoid duplicates
      if (song.id && !songs[song.id]) {
        songs[song.id] = song
      }
    }
  }
  return songs
}

export default {
  getPastPlaylistUrlsFromDocument,
  getProgramsFromDocument,
  getShowsFromDocument,
  getSongsFromDocument,
}