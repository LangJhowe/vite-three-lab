/**
 * 参考 https://github.com/Jeremboo/animated-mesh-lines
 * @param params
 * @returns
 */
export default function FullScreenInBg (params:Record<string, any>) {
  return function (Target:any) {
    return class FullScreenInBg extends Target {
      constructor (props:any) {
        super(props)
        this.dom.class = 'target'
        this.dom.style.position = 'absolute'
        this.dom.style.top = '0'
        this.dom.style.left = '0'
        this.dom.style.zIndex = '1'
        if (params.id) {
          const wrapperDom = document.getElementById(params.id)
          if (wrapperDom) {
            wrapperDom.appendChild(this.dom)
          }
        } else {
          document.body.appendChild(this.dom)
        }
      }
    }
  }
}
