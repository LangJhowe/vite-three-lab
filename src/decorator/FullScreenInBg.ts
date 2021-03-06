/**
 * 参考 https://github.com/Jeremboo/animated-mesh-lines
 * @param params
 * @returns
 */
import { addResizeListener } from '@/utils/resize-handler'
import ResizeObserver from 'resize-observer-polyfill'

interface ResizeDom extends HTMLElement{
  __resizeListeners__?:[]
  __ro__?:ResizeObserver
}
export default (params:Record<string, any>):Function => {
  return (Target:any) => {
    return class FullScreenInBg extends Target {
      constructor (props:any) {
        super(props)
        this.dom.class = 'target'
        this.dom.style.position = 'absolute'
        this.dom.style.top = '0'
        this.dom.style.left = '0'
        this.dom.style.zIndex = '1'

        // initDom
        let wrapperDom:ResizeDom
        if (params.id) {
          const gDom = document.getElementById(params.id)
          if (gDom) {
            wrapperDom = gDom
          } else {
            wrapperDom = document.body
          }
        } else {
          wrapperDom = document.body
        }
        if (wrapperDom) {
          wrapperDom.appendChild(this.dom)
        }
        addResizeListener((wrapperDom as ResizeDom), (e:any) => {
          this.width = wrapperDom.clientWidth
          this.height = wrapperDom.clientHeight
          super.resize(wrapperDom.clientWidth, wrapperDom.clientHeight)
        })
      }

      resize () {
        super.resize(window.innerWidth, window.innerHeight)
      }
    }
  }
}
