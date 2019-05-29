import { EventEmitter } from 'events'
import db from './db'
import dom from './dom-utils'
import wfmu from './wfmu-utils'
import wfmuDb from './wfmu-db'
import { Show, Song } from './interfaces'

class WfmuScraper extends EventEmitter {
  public isReady: boolean = false

  constructor() {
    super()
    this.init()
  }

  private async init(): Promise<void> { }

  private handleError(error: any): void {
    console.log(error.errors)
  }

  private async _scrapeAll(): Promise<void> {
    // Get all programs from schedule
    const schedulePath = '/table'
    const scheduleDocument = await dom.getDocumentFromPath(schedulePath)
    const programs = wfmu.getProgramsFromDocument(scheduleDocument)
    await wfmuDb.saveAll(programs, db.Program)

    // For each program, get all shows
    for (const programId of Object.keys(programs)) {
      await this.scrapeProgram(programId)
    }
  }

  private async _scrapeProgram(programId: string): Promise<{ [id: string]: Show }> {
    // Get past playlist paths (if any) from the page
    // These will be parsed for shows later, after the initial path
    const initialPlaylistPath = `/playlists/${programId}`
    const initialPlaylistDocument = await dom.getDocumentFromPath(initialPlaylistPath)
    const pastPlaylistPaths = wfmu.getPastPlaylistUrlsFromDocument(initialPlaylistDocument)

    // Start by getting shows from the initial playlist
    let playlistShows = wfmu.getShowsFromDocument(initialPlaylistDocument, programId)

    // Then iterate to add shows from past playlists, if they exist
    for (const playlistPath of pastPlaylistPaths) {
      const playlistDocument = await dom.getDocumentFromPath(playlistPath)
      playlistShows = {
        ...playlistShows,
        ...wfmu.getShowsFromDocument(playlistDocument, programId),
      }
      await wfmuDb.saveAll(playlistShows, db.Show)

      for (const playlistShow of Object.values(playlistShows)) {
        await this.scrapeShow(playlistShow.id as string)
      }
    }

    return playlistShows
  }

  private async _scrapeShow(showId: string): Promise<{ [id: string]: Song } | void> {
    const path = `/playlists/shows/${showId}`
    const document = await dom.getDocumentFromPath(path)
    const songs = wfmu.getSongsFromDocument(document, showId)
    await wfmuDb.saveAll(songs, db.Song)
    return songs
  }

  public async scrapeAll(): Promise<void> {
    try {
      return this._scrapeAll()
    } catch (error) {
      return this.handleError(error)
    }
  }

  public async scrapeProgram(programId: string): Promise<{ [id: string]: Show } | void> {
    try {
      return this._scrapeProgram(programId)
    } catch (error) {
      return this.handleError(error)
    }
  }

  public async scrapeShow(showId: string): Promise<{ [id: string]: Song } | void> {
    try {
      return this._scrapeShow(showId)
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export default WfmuScraper