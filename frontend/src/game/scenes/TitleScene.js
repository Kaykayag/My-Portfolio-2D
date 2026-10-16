import Phaser from 'phaser'
import { fitBackground, fitComposition, onResize } from '../viewport.js'

const textStyle = {
  fontFamily: '"Press Start 2P", monospace', color: '#ffe7a1',
  stroke: '#170e0c', strokeThickness: 5, align: 'center',
}

export default class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene') }

  create() {
    this.transitionStarted = false
    this.background = this.add.image(0, 0, 'tableBackground')
    this.composition = this.add.container(0, 0)
    // Only trim transparent padding; the supplied book pixels remain unchanged.
    const texture = this.textures.get('magicBook')
    if (!texture.has('book')) texture.add('book', 0, 756, 349, 1245, 855)
    this.book = this.add.image(640, 350, 'magicBook', 'book').setScale(0.35)
      .setInteractive({ useHandCursor: true })
    this.title = this.add.text(640, 548, 'A forgotten legend awaits...', {
      ...textStyle, fontSize: '32px',
    }).setOrigin(0.5)
    this.subtitle = this.add.text(640, 616, 'CLICK THE BOOK TO CONTINUE', {
      ...textStyle, fontSize: '19px',
    }).setOrigin(0.5)
    this.composition.add([this.book, this.title, this.subtitle])
    this.createSparkles()
    this.startText = this.add.text(0, 0, '[ CLICK TO START ]', {
      ...textStyle, fontSize: '14px', color: '#d3bc8e', strokeThickness: 2,
      padding: { x: 8, y: 12 },
    }).setOrigin(1, 1).setInteractive({ useHandCursor: true })
    this.tweens.add({ targets: this.startText, alpha: 0.35, duration: 650,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
    this.book.on('pointerdown', () => this.openBook())
    this.startText.on('pointerdown', () => this.openBook())
    const start = () => this.openBook()
    this.input.keyboard?.on('keydown-ENTER', start)
    this.input.keyboard?.on('keydown-SPACE', start)
    this.events.once('shutdown', () => {
      this.input.keyboard?.off('keydown-ENTER', start)
      this.input.keyboard?.off('keydown-SPACE', start)
    })
    onResize(this, this.layout)
    this.tweens.add({ targets: this.book, y: '-=6', duration: 1800,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut' })
  }

  layout() {
    fitBackground(this, this.background)
    const portrait = this.scale.height > this.scale.width
    const width = portrait ? 720 : 1280
    const height = portrait ? 1000 : 720
    fitComposition(this, this.composition, width, height)
    this.book.setPosition(width / 2, portrait ? 430 : 350)
    this.title.setPosition(width / 2, portrait ? 650 : 548)
      .setFontSize(portrait ? 29 : 32)
      .setWordWrapWidth(portrait ? 650 : 1180)
    this.subtitle.setPosition(width / 2, portrait ? 765 : 616)
      .setFontSize(portrait ? 17 : 19)
    this.sparkles.setPosition(width / 2, portrait ? 430 : 350)
    this.startText.setPosition(this.scale.width - 16, this.scale.height - 16)
      .setFontSize(this.scale.width < 600 ? 11 : 14)
  }

  createSparkles() {
    const texture = this.textures.get('magicBook')
    if (!texture.has('gold-mote')) texture.add('gold-mote', 0, 1376, 676, 4, 4)
    this.sparkles = this.add.particles(640, 350, 'magicBook', {
      frame: 'gold-mote', x: { min: -230, max: 230 }, y: { min: -220, max: 90 },
      lifespan: { min: 1400, max: 2600 }, speedY: { min: -22, max: -8 },
      speedX: { min: -6, max: 6 }, scale: { start: 0.8, end: 0 },
      alpha: { start: 0.85, end: 0 }, frequency: 100,
      blendMode: Phaser.BlendModes.ADD,
    })
    this.composition.add(this.sparkles)
  }

  openBook() {
    if (this.transitionStarted) return
    this.transitionStarted = true
    this.book.disableInteractive()
    this.startText.disableInteractive()
    this.tweens.killTweensOf(this.book)
    this.tweens.add({ targets: this.book, scaleX: this.book.scaleX * 1.08,
      scaleY: this.book.scaleY * 1.08, duration: 240, ease: 'Back.easeOut' })
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('OverworldScene'))
    this.cameras.main.fadeOut(700, 255, 246, 205)
  }
}
