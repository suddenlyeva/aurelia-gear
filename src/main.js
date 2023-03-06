import keyboard from 'pixi.js-keyboard';
import game from '@/system/game';
import resources from '@/system/resources';
import letterbox from '@/system/letterbox';
import sceneResize from '@/system/resize';
import level from '@/scenes/level';

require('@/system/textures');

game.loader.load((res) => {
  resources.___load(res.resources);
  letterbox.create(resources.black.texture);
  level.open();
  // Listen for frame updates
  game.ticker.add((delta) => {
    let adjustedDelta = (delta / 60) * 144;
    game.stage.update(adjustedDelta);
    sceneResize();
    letterbox.update();
    keyboard.update();
  });
});
