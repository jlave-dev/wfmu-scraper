import { EventEmitter } from 'events'
import dom from './dom'
import wfmu from './wfmu'
import { Show, Song } from './interfaces'

class WfmuScraper extends EventEmitter {
  public isReady: boolean = false
  private _pastPlaylistPaths: string[] = []
  private _shows: Show[] = []
  private _songs: Song[] = []

  constructor(private initialPlaylistId: string) {
    super()
    this.init(initialPlaylistId)
  }

  get shows(): Show[] {
    return this._shows
  }

  get songs(): Song[] {
    return this._songs
  }

  private async init(initialPlaylistId: string): Promise<void> {
    try {
      // Get past playlist paths (if any) from the page
      // These will be parsed for shows later, after the initial path
      const initialPlaylistPath = `/playlists/${initialPlaylistId}`
      const initialPlaylistDocument = await dom.getDocumentFromPath(initialPlaylistPath)
      this._pastPlaylistPaths = wfmu.getPastPlaylistUrlsFromDocument(initialPlaylistDocument)

      // Start by getting shows from the initial playlist
      this._shows = wfmu.getShowsFromDocument(initialPlaylistDocument)

      // Then iterate to add shows from past playlists, if they exist
      for (const playlistPath of this._pastPlaylistPaths) {
        const playlistDocument = await dom.getDocumentFromPath(playlistPath)
        const playlistShows = wfmu.getShowsFromDocument(playlistDocument)
        this._shows = [...this._shows, ...playlistShows]
      }

      this.isReady = true
      this.emit('ready', this)
    } catch (error) {
      console.error(error)
    }
  }
}

export default WfmuScraper