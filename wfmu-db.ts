import { Program, Show, Song } from './interfaces'
import config from './config'

async function saveAll(
  items: { [id: string]: Program | Show | Song },
  itemModel: any,
): Promise<void> {
  if (!config.WRITE_TO_DB) {
    return
  }

  for (const item of Object.values(items)) {
    try {
      await (itemModel as any).create(item)
    } catch (error) {
      console.error(error)
    }
  }
}

export default {
  saveAll,
}