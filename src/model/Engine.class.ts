
import { WebGLRenderer, Scene, PerspectiveCamera, Color, OrthographicCamera, Object3D } from 'three'
import defsDeep from 'lodash.defaultsdeep'

interface EngineOpts {
  w?: number,
  h?: number,
  bgColor?:Color | string | number,
  cameraType: String,
  ratio?: number
}
const engineDefOpts:EngineOpts = {
  w: 400,
  h: 400,
  bgColor: 0x00000000,
  cameraType: 'p',

  ratio: 20
}
class Engine {
  width: number
  height: number
  ratio: number
  dom: HTMLElement
  devicePixelRatio: number
  camera: PerspectiveCamera|OrthographicCamera
  renderer= new WebGLRenderer({ antialias: true, alpha: true })
  scene = new Scene()
  constructor (params?:Record<string, any>) {
    const opts = defsDeep(params, engineDefOpts)
    const ratio = opts.ratio

    this.ratio = ratio
    this.width = opts.w
    this.height = opts.h
    this.devicePixelRatio = window.devicePixelRatio ? Math.min(1.6, window.devicePixelRatio) : 1
    this.renderer.setPixelRatio(this.devicePixelRatio)
    this.renderer.setClearColor(opts.bgColor)
    this.dom = this.renderer.domElement

    if (opts.cameraType === 'p') {
      // this.camera = new PerspectiveCamera()
      this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 1000)
    } else {
      this.camera = new OrthographicCamera(-opts.w, opts.w, opts.h, -opts.h, -1000, 1000)
    }
    this.camera.lookAt(0, 0, 0)
    this.camera.position.set(10, 10, 10)

    this.update = this.update.bind(this)
    this.resize = this.resize.bind(this)
  }

  start ():void {
    this.update()
  }

  update (): void {
    this.render()
    requestAnimationFrame(this.update)
  }

  render (): void {
    this.renderer.render(this.scene, this.camera)
  }

  resize (w:number, h:number):void {
    this.width = w
    this.height = h
    if (this.camera instanceof PerspectiveCamera) {
      this.camera.aspect = this.width / this.height
    } else {
      this.camera.left = -this.width / 200
      this.camera.right = this.width / 200
      this.camera.top = this.height / 200
      this.camera.bottom = -this.height / 200
    }
    this.camera.updateProjectionMatrix()
    this.resizeRender()
  }

  resizeRender (): void {
    this.renderer.setSize(this.width, this.height)
  }

  add (mesh:Object3D):void {
    this.scene.add(mesh)
  }
}

export default Engine
