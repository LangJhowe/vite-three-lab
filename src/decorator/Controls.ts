import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default (params?:Record<string, any>):Function => {
  return (Target:any) => {
    return class Controls extends Target {
      constructor (props:any) {
        super(props)
        this.cameraControl = new OrbitControls(
          this.camera,
          this.renderer.domElement
        )
        this.update = this.update.bind(this)
      }

      update () {
        super.update()
        this.cameraControl.update()
      }
    }
  }
}
