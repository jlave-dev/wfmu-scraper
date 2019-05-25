interface Show {
  date: Date | null,
  title: string | null,
  showUrl: string | null
  streamUrl: string | null,
  playerUrl: string | null,
}

interface Song {
  artist: string | null,
  title: string | null,
  album: string | null,
  label: string | null,
  format: string | null,
}

export {
  Show,
  Song,
}