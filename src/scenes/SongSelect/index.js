import * as PIXI from 'pixi.js';
import keyboard from 'pixi.js-keyboard';
import game from '@/system/game';
import config from '@/system/config';
import resources from '@/system/resources';
import tracks from '@/data/tracks';
import Level from '@/scenes/Level';
import loadTrack from '@/data/tracks/loader';

let scene = new PIXI.Container();

let songs = new PIXI.Container();

let customTracks = [];

scene.open = () => {
  game.renderer.plugins.interaction.cursorStyles.default = 'inherit';
  if (!scene.initialized) {
    scene.initialize();
    scene.initialized = true;
  }

  songs.build();

  game.stage = scene;
};

scene.interactive = true;

scene.initialize = () => {
  //
  // Background

  let background = new PIXI.TilingSprite(resources.gray.texture);
  background.width = config.CANVAS_WIDTH;
  background.height = config.CANVAS_HEIGHT;
  scene.addChild(background);

  //
  // Song Select

  scene.addChild(songs);
  songs.x = config.CANVAS_WIDTH / 2 - 280;
  songs.y = config.CANVAS_HEIGHT / 2;
  songs.select = [];
  songs.index = 0;
  songs.throttle = 0;
  songs.moveTo = songs.y;
  songs.yTracer = -12;
  songs.update = (delta) => {
    if (songs.throttle > 0) {
      songs.throttle -= delta;
    } else {
      if (keyboard.isKeyDown('ArrowDown', 'KeyS')) {
        if (songs.index != songs.select.length - 1) {
          songs.index++;
          songs.moveTo -= 150;
        }
        songs.throttle = 15;
      } else if (keyboard.isKeyDown('ArrowUp', 'KeyW')) {
        if (songs.index > 0) {
          songs.index--;
          songs.moveTo += 150;
        }
        songs.throttle = 15;
      }
    }

    songs.y = (songs.moveTo + songs.y) / 2;

    if (keyboard.isKeyPressed('Enter', 'Space')) {
      new Level(songs.select[songs.index].track);
    }

    for (let song of songs.select) {
      song.update();
    }
  };

  window.addEventListener('wheel', (event) => {
    if (event.wheelDelta > 0) {
      if (songs.index > 0) {
        songs.index--;
        songs.moveTo += 150;
      }
    }
    if (event.wheelDelta < 0) {
      if (songs.index != songs.select.length - 1) {
        songs.index++;
        songs.moveTo -= 150;
      }
    }
  });

  songs.build = () => {
    for (let song of songs.select) {
      songs.removeChild(song);
    }
    songs.select = [];

    songs.yTracer = -12;

    let addSong = (track) => {
      let song = new PIXI.Text(
        '[ ' + track.difficulty + ' ]  ' + track.artist + ' - ' + track.title,
      );
      song.anchor.set(0, 0.5);
      song.y = songs.yTracer;
      song.style = {
        fill: 0xffffff,
        fontSize: '30px',
      };
      song.track = track;
      songs.select.push(song);
      songs.addChild(song);

      song.interactive = true;
      song.buttonMode = true;
      song.on('click', () => {
        let songIndex = songs.select.indexOf(song);
        if (songs.index == songIndex) {
          new Level(songs.select[songs.index].track);
        } else {
          let difference = songIndex - songs.index;
          songs.index += difference;
          songs.moveTo -= difference * 150;
        }
      });
      song.hitArea = new PIXI.Rectangle(0, -25, config.CANVAS_WIDTH, 100);
      song.update = () => {
        if (songs.index == songs.select.indexOf(song)) {
          song.style.fill = 0xbbffff;
        } else {
          song.style.fill = 0xffffff;
        }
      };
      songs.yTracer += 150;
    };

    //
    // Add Songs
    for (let track of tracks.list) {
      if (track.locked) {
        continue;
      }
      addSong(track);
    }

    for (let track of customTracks) {
      addSong(track);
    }

    customPrompt.y = songs.yTracer + 65;
  };

  //
  // Select a Song
  let selectText = new PIXI.Text('=  S o n g  S e l e c t  =');
  selectText.style = {
    fill: 0xffffff,
    fontSize: '60px',
  };
  selectText.y = -240;
  selectText.x = -38;
  selectText.height = 70;
  songs.addChild(selectText);

  //
  // osu! drag and drop prompt
  let customPrompt = new PIXI.Container();
  customPrompt.y = songs.yTracer + 65;

  let osuLogo = new PIXI.Sprite(resources.osu.texture);
  osuLogo.width = 180;
  osuLogo.height = 180;
  osuLogo.y = -13;
  osuLogo.x = -13;
  osuLogo.interactive = true;
  osuLogo.on('click', () => {
    window.open('https://osu.ppy.sh/beatmapsets');
  });
  osuLogo.buttonMode = true;
  osuLogo.defaultCursor = 'pointer';

  let customPrompt1 = new PIXI.Text('Drag + Drop a beatmap folder from');
  customPrompt1.style.fill = 0xffffff;
  customPrompt1.x = 180;
  customPrompt1.y = 10;
  let customPrompt2 = new PIXI.Text('osu!/Songs/...');
  customPrompt2.x = 180;
  customPrompt2.y = 55;
  customPrompt2.style = {
    fill: 0xfe66aa,
    fontWeight: 'bold',
    fontSize: '40px',
  };
  let customPrompt3 = new PIXI.Text('to play custom tracks!');
  customPrompt3.style.fill = 0xffffff;
  customPrompt3.x = 180;
  customPrompt3.y = 115;
  songs.addChild(customPrompt);
  customPrompt.addChild(osuLogo);
  customPrompt.addChild(customPrompt1);
  customPrompt.addChild(customPrompt2);
  customPrompt.addChild(customPrompt3);

  //
  // osu! integration

  document.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  document.addEventListener('drop', (event) => {
    event.preventDefault();

    for (let item of event.dataTransfer.items) {
      let entry = item.webkitGetAsEntry();
      if (entry.isDirectory) {
        let reader = entry.createReader();
        reader.readEntries((entries) => {
          let osuFiles = entries.filter((f) => f.name.includes('.osu'));

          for (let o of osuFiles) {
            o.file((osuFile) => {
              let reader = new FileReader();
              reader.readAsText(osuFile);
              reader.onload = () => {
                let track = loadTrack(reader.result);
                let mp3 = entries.find((f) => f.name == track.audioName);
                track.key = o.fullPath;
                mp3.file((file) => {
                  track.audio = URL.createObjectURL(file);
                  customTracks.push(track);
                  songs.build();
                });
              };
            });
          }
        });
      }
    }
  });
};

scene.update = (delta) => {
  songs.update(delta);
};

export default scene;
