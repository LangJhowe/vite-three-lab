import 'normalize.css'
import './style.styl'

import * as THREE from 'three'
import Engine from './model/Engine.class'
import FullScreenInBg from './decorator/FullScreenInBg'
import Helpers from './decorator/Helpers'
import Controls from './decorator/Controls'
import drawrange from './offical-demo/drawrange'

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
  const engine = new CustomEngine({ cameraType: 'p', bgColor: '#000' })

  engine.start()

  drawrange(engine)
  // dynamic change mesh
  const sphereGeometry = new THREE.SphereGeometry(1, 128, 128)
  // const material = new THREE.MeshNormalMaterial()
  // const material = new THREE.PointsMaterial({ color: 0xffffffff })
  function generateSprite () {
    const canvas = engine.renderer.domElement

    const context = canvas.getContext('2d')
    if (context) {
      const gradient = context.createRadialGradient(engine.width / 2, engine.height / 2, 0, engine.width / 2, engine.height / 2, engine.width / 2)
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.2, 'rgba(0,255,255,1)')
      gradient.addColorStop(0.4, 'rgba(0,0,64,1)')
      gradient.addColorStop(1, 'rgba(0,0,0,1)')

      context.fillStyle = gradient
      context.fillRect(0, 0, engine.width, engine.height)
    }

    const texture = new THREE.Texture(canvas)
    texture.needsUpdate = true
    return texture
  }
  const material = new THREE.PointsMaterial({
    color: '#0468ec',
    size: 1,
    opacity: 1,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    map: generateSprite()
  })

  const sphere = new THREE.Points(sphereGeometry, material)
  sphere.position.x = 3
  sphere.position.y = 3
  sphere.position.z = 3
  engine.add(sphere)
  // const k = 3
  console.log(sphere)
  const position = sphere.geometry.attributes.position
  engine.addUpdateArr(() => {
    const n = new Float32Array(position.array.length)
    const v = new THREE.Vector3()
    for (let i = 0; i < position.count; i++) {
      v.fromBufferAttribute(position, i).normalize()
      v.x = v.x + 0.001
      n[i * 3] = v.x
      n[i * 3 + 1] = v.y
      n[i * 3 + 2] = v.z
    }
    sphere.geometry.setAttribute('position', new THREE.BufferAttribute(n, 3))
    position.needsUpdate = true
  })
  console.log(window)
}
