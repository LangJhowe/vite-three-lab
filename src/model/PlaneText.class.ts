import { ShapeGeometry, Font, FontLoader, MeshBasicMaterial, Color, Mesh } from 'three'
import defsDeep from 'lodash.defaultsdeep'
import fontJson from '@/assets/three/font/Cyberpunk_Regular.json'
// import fontJson from '@/assets/three/font/fontFile.json'

interface PlaneTextOpts {
  size?: number,
  color?: Color | string | number
  wireframe?: boolean
  letterSpacing?: number
  fontJson?:Record<string, any>,
}
const planeTextDeFOpts:PlaneTextOpts = {
  size: 1,
  color: '#00ff00',
  wireframe: false,
  letterSpacing: 0.03,
  fontJson: fontJson
}
export default class PlaneText extends Mesh {
  basePosition: number
  text: string
  size: number
  font: Font
  constructor (
    text:string,
    params?:PlaneTextOpts
  ) {
    const opts = defsDeep(params, planeTextDeFOpts) as PlaneTextOpts
    super()

    this.basePosition = 0
    this.size = opts.size || 0
    this.text = text
    const fontLoader = new FontLoader()
    const font = fontLoader.parse(opts.fontJson)
    this.font = font
    const letters = [...text]
    letters.forEach(letter => {
      if (letter === ' ') {
        this.basePosition += this.size * 0.5
      } else {
        const geom = new ShapeGeometry(
          font.generateShapes(letter, this.size)
        )
        geom.computeBoundingBox()// 计算宽高
        const mat = new MeshBasicMaterial({
          color: opts.color,
          opacity: 1,
          transparent: false,
          wireframe: opts.wireframe // 渲染为平面多边形
        })
        const mesh = new Mesh(geom, mat)

        mesh.position.x = this.basePosition

        if (geom && geom.boundingBox && opts.letterSpacing) {
          this.basePosition +=
            geom.boundingBox.max.x + opts.letterSpacing
        }
        this.add(mesh)
      }
    })
  }
}
