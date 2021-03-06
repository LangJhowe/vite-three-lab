import { GridHelper, AxesHelper } from 'three'
import defsDeep from 'lodash.defaultsdeep'

interface GridHelperOpts{
  size?: number,
  divisions?: number,
}
interface AxesHelperOpts{
  size?: number,
}
interface HelperOpts {
  grid?: GridHelperOpts,
  axes?: AxesHelperOpts
}

const helperDefOpts:HelperOpts = {}
export default (params?:Record<string, any>):Function => {
  return (Target:any) => {
    return class Helper extends Target {
      constructor (props:any) {
        const opts = defsDeep(params, helperDefOpts)
        super(props)
        if (opts.grid) {
          const gridHelper = new GridHelper(opts.grid.size, opts.grid.divisions)
          this.scene.add(gridHelper)
        }
        if (opts.axes) {
          const axesHelper = new AxesHelper(5)
          this.scene.add(axesHelper)
        }
      }
    }
  }
}
