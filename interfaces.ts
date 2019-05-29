interface Program {
  id: string | null,
  title: string | null,
}

interface Show {
  id: string | null,
  programId: string,
  date: Date | null,
  title: string | null,
  showPath: string | null
  streamPath: string | null,
  playerPath: string | null,
}

interface Song {
  id: string | null,
  showId: string | null,
  artist: string | null,
  title: string | null,
  album: string | null,
  label: string | null,
  year: number | null,
  image: string | null,
  format: string | null,
  comments: string | null,
}

export {
  Program,
  Show,
  Song,
}