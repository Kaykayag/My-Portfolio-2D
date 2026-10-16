// Scale foreground composition independently from the untouched, full-bleed artwork.
export function fitBackground(scene, image, overscan = 1) {
  const { width, height } = scene.scale
  const source = image.texture.getSourceImage()
  image.setPosition(width / 2, height / 2)
    .setScale(Math.max(width / source.width, height / source.height) * overscan)
}

export function fitComposition(scene, container, width, height) {
  const scale = Math.min(scene.scale.width / width, scene.scale.height / height)
  container.setScale(scale).setPosition(
    (scene.scale.width - width * scale) / 2,
    (scene.scale.height - height * scale) / 2,
  )
}

export function onResize(scene, callback) {
  callback.call(scene)
  scene.scale.on('resize', callback, scene)
  scene.events.once('shutdown', () => scene.scale.off('resize', callback, scene))
}
