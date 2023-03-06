import * as PIXI from 'pixi.js';
import game from '@/system/game';
import config from '@/system/config';
import resources from '@/system/resources';

let scene = new PIXI.Container();
scene.interactive = true;

scene.open = () => {
  game.renderer.plugins.interaction.cursorStyles.default = 'inherit';
  if (!scene.initialized) {
    scene.initialize();
    scene.initialized = true;
  }
  game.stage = scene;
};

scene.initialize = () => {
  //
  // Background

  let background = new PIXI.TilingSprite(resources.black.texture);
  background.width = config.CANVAS_WIDTH;
  background.height = config.CANVAS_HEIGHT;
  scene.addChild(background);
};

scene.update = () => {};

export default scene;
