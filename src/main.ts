import 'normalize.css'
import './style.styl'

import * as THREE from 'three'
import Engine from './model/Engine.class'
import FullScreenInBg from './decorator/FullScreenInBg'
import Helpers from './decorator/Helpers'
import Controls from './decorator/Controls'
import PlaneText from './model/PlaneText.class'

const helperOpts = {
  grid: {
    size: 100,
    divisions: 100
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
  const engine = new CustomEngine({ cameraType: 'p' })
  engine.start()

  const geometry = new THREE.PlaneGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.z = 0
  engine.add(plane)

  const geometry1 = new THREE.BoxGeometry(1, 1, 1)
  const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry1, material1)
  cube.position.z = 3
  engine.add(cube)

  const planText1 = new PlaneText('cyberpunk', { color: '#EEE600' })
  planText1.position.y = 3
  console.log(planText1.position)

  engine.add(planText1)
}
