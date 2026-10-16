import Phaser from 'phaser'

import mage from '../../assets/characters/character MAGE.png'
import corporate from '../../assets/characters/corporate.png'
import uniform from '../../assets/characters/uniform.png'
import visitor2 from '../../assets/characters/visitor 2.png'
import visitor3 from '../../assets/characters/visitor 3.png'
import castle from '../../assets/environment/castle.png'
import contactme from '../../assets/environment/contactme.png'
import forest from '../../assets/environment/forest.png'
import projectLand from '../../assets/environment/land_project.png'
import tableBackground from '../../assets/environment/tablebg.png'
import lightRealm from '../../assets/environment/light realm.png'
import nightRealm from '../../assets/environment/night realm.png'
import acuvia from '../../assets/projects/ACUVIA.png'
import aura from '../../assets/projects/AURA.png'
import brainrot from '../../assets/projects/BRAINROT.png'
import gourmate from '../../assets/projects/gourmate.png'
import retrosyn from '../../assets/projects/RETROSYN.png'
import campIsland from '../../assets/landmark/Camp island.png'
import castleIsland from '../../assets/landmark/Castle island.png'
import forestIsland from '../../assets/landmark/Forest treehouse island.png'
import mountainIsland from '../../assets/landmark/Mountain workshop island.png'
import notFound from '../../assets/ui/404.png'
import aboutIcon from '../../assets/ui/About me — original icon.png'
import centerBridge from '../../assets/ui/Center bridge.png'
import contactIcon from '../../assets/ui/Contact — original icon.png'
import emptyPanel from '../../assets/ui/Empty selection panel.png'
import error from '../../assets/ui/error.png'
import leftBridge from '../../assets/ui/Left bridge.png'
import magicBook from '../../assets/ui/magic book.png'
import mapBorder from '../../assets/ui/mapborder.png'
import projectsIcon from '../../assets/ui/Projects — original icon.png'
import rightBridge from '../../assets/ui/Right bridge.png'
import scroll from '../../assets/ui/scroll.png'
import skillsIcon from '../../assets/ui/Skills — original icon.png'
import standy from '../../assets/ui/standy.png'

const imageAssets = {
  mage,
  corporate,
  uniform,
  visitor2,
  visitor3,
  castle,
  contactme,
  forest,
  projectLand,
  tableBackground,
  lightRealm,
  nightRealm,
  ACUVIA: acuvia,
  AURA: aura,
  BRAINROT: brainrot,
  gourmate,
  RETROSYN: retrosyn,
  campIsland,
  castleIsland,
  forestIsland,
  mountainIsland,
  notFound,
  aboutIcon,
  centerBridge,
  contactIcon,
  emptyPanel,
  error,
  leftBridge,
  magicBook,
  mapBorder,
  projectsIcon,
  rightBridge,
  scroll,
  skillsIcon,
  standy,
}

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() {
    const { width, height } = this.scale
    const progress = this.add
      .rectangle(width / 2 - 120, height / 2, 0, 8, 0xffd66b)
      .setOrigin(0, 0.5)

    this.load.on('progress', (value) => {
      progress.width = 240 * value
    })
    Object.entries(imageAssets).forEach(([key, path]) => {
      this.load.image(key, path)
    })
  }

  create() {
    this.scene.start('TitleScene')
  }
}
