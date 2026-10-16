/** A reusable framed text panel for all Phaser scene copy. */
export default class DialogPanel {
  constructor(scene, {
    x,
    y,
    width,
    height,
    text,
    depth = 20,
    fontSize = 13,
    color = '#ffe7a1',
  }) {
    this.scene = scene
    this.frame = scene.add
      .image(x, y, 'emptyPanel')
      .setDisplaySize(width, height)
      .setDepth(depth)

    this.text = scene.add
      .text(x, y - 2, text, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: `${fontSize}px`,
        color,
        align: 'center',
        lineSpacing: 12,
        wordWrap: { width: width * 0.82, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setDepth(depth + 1)
  }

  setText(text) {
    this.text.setText(text)
    return this
  }

  setVisible(visible) {
    this.frame.setVisible(visible)
    this.text.setVisible(visible)
    return this
  }

  destroy() {
    this.frame.destroy()
    this.text.destroy()
  }
}
