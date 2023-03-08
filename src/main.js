import keyboard from 'pixi.js-keyboard';
import game from '@/system/game';
import resources from '@/system/resources';
import letterbox from '@/system/letterbox';
import sceneResize from '@/system/resize';
import SongSelect from '@/scenes/SongSelect';

require('@/system/textures');

game.loader.load((res) => {
  resources.___load(res.resources);
  letterbox.create(resources.black.texture);
  SongSelect.open();
  // Listen for frame updates
  game.ticker.add((delta) => {
    game.stage.update(delta);
    sceneResize();
    letterbox.update();
    keyboard.update();
  });
});
