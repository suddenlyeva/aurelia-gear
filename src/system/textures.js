import game from '@/system/game';

require
  .context('/public/', true, /\.png$/)
  .keys()
  .forEach((key) => {
    let name = key
      .split('/')
      .slice(-1)[0]
      .slice(0, -4);
    game.loader.add(name, name + '.png');
  });
