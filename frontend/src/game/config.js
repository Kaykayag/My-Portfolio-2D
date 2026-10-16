import Phaser from 'phaser'
import PreloadScene from './scenes/PreloadScene.js'
import TitleScene from './scenes/TitleScene.js'
import OverworldScene from './scenes/OverworldScene.js'

export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720

const gameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'phaser-game',
  backgroundColor: '#17242e',
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [PreloadScene, TitleScene, OverworldScene],
}

export default gameConfig
