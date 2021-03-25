import 'normalize.css'
import './style.styl'

import Engine from './model/Engine.class'
import FullScreenInBg from './decorator/FullScreenInBg'
import Helpers from './decorator/Helpers'
import Controls from './decorator/Controls'
import './libs/bas1.js'
// import d7 from './demo/d7/d7'
import d8 from './demo/d8'
// import d5 from './demo/d5'

const helperOpts = {
  grid: {
    size: 1000,
    divisions: 1000
  },
  axes: { size: 5 }
}
@Controls()
@Helpers(helperOpts)
@FullScreenInBg({ id: 'app' })
class CustomEngine extends Engine {}

const dom = document.querySelector('#app')
if (dom) {
  dom.innerHTML = ''
  const engine = new CustomEngine({ cameraType: 'p', bgColor: '#000' })

  engine.start()
  console.log(engine)

  // d5(engine)
  // d7(engine)
  d8(engine)
  // d6(engine)
}
