import loadTrack from '@/data/tracks/loader'

let tracks = { list: [] }

let context = require.context("/public/", true, /\.osu$/)
context.keys().forEach(async key => {
  let response = await fetch(key)
  let body = await response.text()

  let track = loadTrack(body, key)
  if (track.difficulty.includes('RemiX') 
  // || track.difficulty.includes('UNBEATABLE')
  ) {
    track.locked = true
  }
  tracks.list.push(track)
  
  tracks.list.sort((a, b) => {

    let packOrder = ('' + a.pack).localeCompare(b.pack)
    let unlockableAfter = a.locked === undefined && b.locked !== undefined
    let unlockableBefore = a.locked !== undefined && b.locked === undefined
    let trackOrder = ('' + a.key).localeCompare(b.key)

    if (packOrder) return packOrder
    else if (unlockableAfter) {
      return -1
    }
    else if (unlockableBefore) {
      return 1
    }
    else return trackOrder
            
  })
})



export default tracks