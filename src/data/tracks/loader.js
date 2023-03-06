export default function(body, path = null) {
  
  body = body.replace(/\r/gm,'')

  let beatsPerMS = body.split('[TimingPoints]\n')[1].split('\n')[0].split(',')[1]
  let lifetime = beatsPerMS * 8

  while (lifetime < 3692) {
    lifetime *= 2
  }

  let objects = body.split('[HitObjects]\n')[1].split('\n')
  let title = body.split('Title:')[1].split('\n')[0]
  let artist = body.split('Artist:')[1].split('\n')[0]
  let difficulty = body.split('Version:')[1].split('\n')[0]
  let audioName = body.split('AudioFilename: ')[1].split('\n')[0]

  let track = {
    title,
    artist,
    difficulty,
    lifetime,
    audioName,
    events: objects.map(object => {
      let time = +object.split(',')[2]
      let type = +object.split(',')[4]
      let change = +object.split(',')[3] > 3
      return { time, type, change }
    })
  }

  if (path != null) {
    track.audio = path.split('/').slice(0,-1).join('/') + '/' + track.audioName
    track.pack = path.split('/')[2]
    let withoutPack = path.split('/')
    withoutPack.splice(2,1)
    track.key = withoutPack.join('/')
  }

  return track
}