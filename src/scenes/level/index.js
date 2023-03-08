import * as PIXI from 'pixi.js';
import game from '@/system/game';
import config from '@/system/config';
import resources from '@/system/resources';
import SongSelect from '@/scenes/SongSelect';
import keyboard from 'pixi.js-keyboard';

const Level = (trackData) => {
  let scene = new PIXI.Container();
  scene.interactive = true;
  game.stage = scene;

  const noteTrack = new PIXI.Container();
  const notes = [];
  const audio = new Audio(trackData.audio);
  audio.volume = 0.2;
  audio.play();

  //
  // Background

  let background = new PIXI.TilingSprite(resources.gray.texture);
  background.width = config.CANVAS_WIDTH;
  background.height = config.CANVAS_HEIGHT;
  scene.addChild(background);

  let leftTrack = new PIXI.TilingSprite(resources.white.texture);
  leftTrack.anchor.set(0.5, 0.5);
  leftTrack.width = 3;
  leftTrack.height = config.CANVAS_HEIGHT;
  leftTrack.x = 150;
  leftTrack.y = config.CANVAS_HEIGHT / 2;
  scene.addChild(leftTrack);

  let rightTrack = new PIXI.TilingSprite(resources.white.texture);
  rightTrack.anchor.set(0.5, 0.5);
  rightTrack.width = 3;
  rightTrack.height = config.CANVAS_HEIGHT;
  rightTrack.x = 330;
  rightTrack.y = config.CANVAS_HEIGHT / 2;
  scene.addChild(rightTrack);

  const judgmentCircle = new PIXI.Sprite(resources.circle.texture);
  judgmentCircle.anchor.set(0.5, 0.5);
  judgmentCircle.width = 250;
  judgmentCircle.height = 250;
  judgmentCircle.x = 240;
  judgmentCircle.y = config.CANVAS_HEIGHT / 2;
  scene.addChild(judgmentCircle);

  const judgmentLine = new PIXI.Sprite(resources.white.texture);
  judgmentLine.anchor.set(0.5, 0.5);
  judgmentLine.width = 200;
  judgmentLine.height = 6;
  judgmentLine.x = 240;
  judgmentLine.y = config.CANVAS_HEIGHT / 2;
  scene.addChild(judgmentLine);

  trackData.events.map((event) => {
    const isLeft = event.type === 0;

    let note = new PIXI.TilingSprite(isLeft ? resources.blue.texture : resources.cyan.texture);
    note.anchor.set(0.5, 0.5);
    note.x = isLeft ? 200 : 280;
    note.y = config.CANVAS_HEIGHT / 2 - event.time;
    note.height = 30;
    note.width = 60;
    notes.push(note);
    noteTrack.addChild(note);
  });

  scene.addChild(noteTrack);

  scene.update = (delta) => {
    noteTrack.y += (delta * 1000) / 60;
    if (keyboard.isKeyPressed('Escape')) {
      audio.pause();
      SongSelect.open();
    }
  };

  return scene;
};

export default Level;
