
import { WebGLRenderer } from 'three'
import defsDeep from 'lodash.defaultsdeep'

interface EngineOpts {
  w: number,
  h: number
}
const engineDefOpts:EngineOpts = {
  w: 400,
  h: 400
}
class Engine {
  width: number
  height: number
  dom: HTMLElement
  renderer= new WebGLRenderer({ antialias: true, alpha: true })
  constructor (param?:Record<string, any>) {
    const opts = defsDeep(param, engineDefOpts)
    this.width = opts.w
    this.height = opts.h
    this.dom = this.renderer.domElement
  }
}
export default Engine
