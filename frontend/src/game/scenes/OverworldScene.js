import Phaser from 'phaser'
import DialogPanel from '../ui/DialogPanel.js'
import { fitBackground, fitComposition, onResize } from '../viewport.js'

const LANDMARKS = [
  { key: 'about', title: 'ABOUT ME', asset: 'castleIsland', icon: 'aboutIcon', x: 195, y: 375, width: 270, height: 510, labelY: 65 },
  { key: 'projects', title: 'PROJECTS', asset: 'mountainIsland', icon: 'projectsIcon', x: 515, y: 350, width: 300, height: 500, labelY: 65 },
  { key: 'skills', title: 'SKILLS', asset: 'forestIsland', icon: 'skillsIcon', x: 850, y: 325, width: 330, height: 440, labelY: 65 },
  { key: 'contact', title: 'CONTACT', asset: 'campIsland', icon: 'contactIcon', x: 1130, y: 310, width: 190, height: 340, labelY: 120 },
]

export default class OverworldScene extends Phaser.Scene {
  constructor() { super('OverworldScene') }

  create() {
    this.selectedKey = null
    this.background = this.add.image(0, 0, 'nightRealm').setDepth(-10)
    this.composition = this.add.container(0, 0)
    this.landmarks = LANDMARKS.map((item, index) => this.createLandmark(item, index))
    this.instructionPanel = new DialogPanel(this, {
      x: 640, y: 655, width: 540, height: 96,
      text: 'Select a realm to explore...', depth: 12, fontSize: 17,
    })
    this.composition.add([this.instructionPanel.frame, this.instructionPanel.text])
    this.drift = { phase: 0 }
    this.tweens.add({ targets: this.drift, phase: Math.PI * 2, duration: 45000,
      repeat: -1, ease: 'Linear' })
    onResize(this, this.layout)
    this.cameras.main.fadeIn(400, 255, 246, 205)
    // Keep keyboard navigation without a character walking across the sky.
    const navigate = (event) => {
      if (document.querySelector('[role="dialog"]')) return
      const index = this.landmarks.findIndex(({ key }) => key === this.selectedKey)
      if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        const step = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1
        this.selectLandmark(this.landmarks[(index + step + 4) % 4].key)
      } else if (event.key === 'Enter' && this.selectedKey) this.openLandmark(this.selectedKey)
    }
    this.input.keyboard?.on('keydown', navigate)
    this.events.once('shutdown', () => this.input.keyboard?.off('keydown', navigate))
  }

  createLandmark(item, index) {
    const { asset, title, icon, key, width, height } = item
    const container = this.add.container(0, 0)
    const floating = this.add.container(0, 0)
    container.add(floating)
    this.composition.add(container)
    const image = this.add.image(0, 0, asset)
    const source = image.texture.getSourceImage()
    image.setScale(Math.min(width / source.width, height / source.height))
    const label = this.add.container(0, 0)
    const labelIcon = this.add.image(0, 0, icon)
    const iconSource = labelIcon.texture.getSourceImage()
    labelIcon.setScale(Math.min(76 / iconSource.width, 85 / iconSource.height))
    const text = this.add.text(0, 0, title, {
      fontFamily: '"Press Start 2P", monospace', fontSize: '23px', color: '#ffe7a1',
      stroke: '#130f19', strokeThickness: 5,
    }).setOrigin(0, 0.5)
    const total = 76 + 8 + text.width
    labelIcon.setX(-total / 2 + 38)
    text.setX(-total / 2 + 84)
    label.add([labelIcon, text])
    const zone = this.add.zone(0, 0, image.displayWidth, image.displayHeight)
      .setInteractive({ useHandCursor: true })
    floating.add([image, label, zone])
    const glow = image.postFX?.addGlow(0xffdf8a, 0, 0, false, 0.1, 12)
    zone.on('pointerover', () => { if (glow) glow.outerStrength = 1.5 })
    zone.on('pointerout', () => { if (glow) glow.outerStrength = 0 })
    zone.on('pointerdown', () => {
      this.selectLandmark(key)
      this.openLandmark(key)
    })
    this.tweens.add({ targets: floating, y: -5 - index, duration: 2400 + index * 370,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: index * 170 })
    return { ...item, container, floating, image, label, zone, shade: { value: 255 } }
  }

  layout() {
    fitBackground(this, this.background, 1.04)
    const portrait = this.scale.height > this.scale.width
    const width = portrait ? 720 : 1280
    const height = portrait ? 1100 : 720
    fitComposition(this, this.composition, width, height)
    this.landmarks.forEach((item, index) => {
      item.container.setPosition(portrait ? 185 + (index % 2) * 350 : item.x,
        portrait ? 295 + Math.floor(index / 2) * 455 : item.y)
      item.container.setScale(portrait ? 0.92 : 1)
      item.label.setY(portrait ? -205 : item.labelY - item.y)
    })
    this.instructionPanel.frame.setPosition(width / 2, height - 65)
    this.instructionPanel.text.setPosition(width / 2, height - 67)
  }

  update() {
    if (!this.drift) return
    // The sky is flattened artwork: drift the whole image, never individual clouds.
    this.background.setPosition(this.scale.width / 2 + Math.sin(this.drift.phase) * 7,
      this.scale.height / 2 + Math.cos(this.drift.phase) * 3)
  }

  selectLandmark(key) {
    this.selectedKey = key
    this.landmarks.forEach((item) => {
      this.tweens.killTweensOf(item.shade)
      this.tweens.add({ targets: item.shade, value: item.key === key ? 176 : 255,
        duration: 280, ease: 'Sine.easeOut', onUpdate: () => {
          const value = Math.round(item.shade.value)
          item.image.setTint(Phaser.Display.Color.GetColor(value, value, value))
        } })
    })
  }

  openLandmark(section) {
    this.game.events.emit('portfolio:open', { section })
  }
}
