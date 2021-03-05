import './style.css'
import 'normalize.css'

import Engine from './model/Engine.class'
import FullScreenInBg from './decorator/FullScreenInBg'
const fs:Function = FullScreenInBg

@fs({ id: 'app' })
class CustomEngine extends Engine {

}

const dom = document.querySelector('#app')
if (dom) {
  dom.innerHTML = `
    <h1>Hello Vite!</h1>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
  `
  const engine = new CustomEngine()
  console.log(engine)
}
