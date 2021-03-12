/* *****************************************
 * HTML5 WebGL很酷的文字
 * https://wow.techbrood.com/fiddle/17803
 * ****************************************/

import * as THREE from 'three'
import { Geometry } from 'three/examples/jsm/deprecated/Geometry'
import fontJson from '@/assets/three/font/Cyberpunk_Regular.json'
import { BAS } from '../libs/bas1.js'
import { Power1, TimelineMax } from 'gsap/gsap-core'

class MGeometry extends Geometry {
  userData:Record<string, any>={}
}
function generateTextGeometry (text) {
  const fontLader = new THREE.FontLoader()
  const params = {
    size: 1,
    height: 0,
    font: fontLader.parse(fontJson),
    // weight: 'bold',
    // style: 'normal',
    // bevelSize: 0.75,
    // bevelThickness: 0.50,
    // bevelEnabled: true,
    anchor: {
      x: 0.5,
      y: 0.0,
      z: 0.5
    }
  }
  const geometry = new THREE.TextGeometry(text, params)

  geometry.computeBoundingBox()

  geometry.userData = {}

  if (geometry.boundingBox) {
    geometry.userData.size = {
      width: geometry.boundingBox.max.x - geometry.boundingBox.min.x,
      height: geometry.boundingBox.max.y - geometry.boundingBox.min.y,
      depth: geometry.boundingBox.max.z - geometry.boundingBox.min.z
    }

    const anchorX = geometry.userData.size.width * -params.anchor.x
    const anchorY = geometry.userData.size.height * -params.anchor.y
    const anchorZ = geometry.userData.size.depth * -params.anchor.z
    const matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ)

    geometry.applyMatrix4(matrix)
  }
  return geometry
}

class TextAnimation extends THREE.Mesh {
  _animationProgress:number
  animationDuration:number
  constructor (geo:MGeometry) {
    const bufferGeometry = new BAS.ModelBufferGeometry(geo)
    const aAnimation = bufferGeometry.createAttribute('aAnimation', 2)
    const aCentroid = bufferGeometry.createAttribute('aCentroid', 3)
    const aControl0 = bufferGeometry.createAttribute('aControl0', 3)
    const aControl1 = bufferGeometry.createAttribute('aControl1', 3)
    const aEndPosition = bufferGeometry.createAttribute('aEndPosition', 3)

    const faceCount = bufferGeometry.faceCount
    let i, i2, i3, i4, v

    const size = geo.userData.size

    const maxDelayX = 2.0
    const maxDelayY = 0.25
    const minDuration = 2
    const maxDuration = 8
    const stretch = 0.25

    for (i = 0, i2 = 0, i3 = 0, i4 = 0; i < faceCount; i++, i2 += 6, i3 += 9, i4 += 12) {
      const face = geo.faces[i]
      const centroid = BAS.Utils.computeCentroid(geo, face)

      // animation
      const delayX = Math.max(0, (centroid.x / size.width) * maxDelayX)
      const delayY = Math.max(0, (1.0 - (centroid.y / size.height)) * maxDelayY)
      const duration = THREE.MathUtils.randFloat(minDuration, maxDuration)

      for (v = 0; v < 6; v += 2) {
        aAnimation.array[i2 + v] = delayX + delayY + Math.random() * stretch
        aAnimation.array[i2 + v + 1] = duration
      }

      // centroid
      for (v = 0; v < 9; v += 3) {
        aCentroid.array[i3 + v] = centroid.x
        aCentroid.array[i3 + v + 1] = centroid.y
        aCentroid.array[i3 + v + 2] = centroid.z
      }

      // ctrl
      const c0x = centroid.x + THREE.MathUtils.randFloat(40, 120)
      const c0y = centroid.y + size.height * THREE.MathUtils.randFloat(0.0, 12.0)
      const c0z = THREE.MathUtils.randFloatSpread(120)

      const c1x = centroid.x + THREE.MathUtils.randFloat(80, 120) * -1
      const c1y = centroid.y + size.height * THREE.MathUtils.randFloat(0.0, 12.0)
      const c1z = THREE.MathUtils.randFloatSpread(120)

      for (v = 0; v < 9; v += 3) {
        aControl0.array[i3 + v] = c0x
        aControl0.array[i3 + v + 1] = c0y
        aControl0.array[i3 + v + 2] = c0z

        aControl1.array[i3 + v] = c1x
        aControl1.array[i3 + v + 1] = c1y
        aControl1.array[i3 + v + 2] = c1z
      }

      // end position
      var x, y, z

      x = 1000// centroid.x + THREE.MathUtils.randFloatSpread(12)
      y = 0// centroid.y + size.height * THREE.MathUtils.randFloat(0.0, 12.0)
      z = 0// THREE.MathUtils.randFloat(-2, 2)

      for (v = 0; v < 9; v += 3) {
        aEndPosition.array[i3 + v] = x
        aEndPosition.array[i3 + v + 1] = y
        aEndPosition.array[i3 + v + 2] = z
      }
    }

    const material = new BAS.BasicAnimationMaterial({
      // flatShading: THREE.FlatShading,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        uTime: {
          type: 'f',
          value: 1
        }
        // diffuse: { value: 0x00ff00 }
      },
      shaderFunctions: [
        BAS.ShaderChunk.cubic_bezier,
        BAS.ShaderChunk.ease_out_cubic
      ],
      shaderParameters: [
        'uniform float uTime;',
        'attribute vec2 aAnimation;',
        'attribute vec3 aCentroid;',
        'attribute vec3 aControl0;',
        'attribute vec3 aControl1;',
        'attribute vec3 aEndPosition;'
      ],
      shaderVertexInit: [
        'float tDelay = aAnimation.x;',
        'float tDuration = aAnimation.y;',
        'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
        'float tProgress =  ease(tTime, 0.0, 1.0, tDuration);'
        // 'float tProgress = tTime / tDuration;'
      ],
      shaderTransformPosition: [
        'vec3 tPosition = transformed - aCentroid;',
        'tPosition *= 1.0 - tProgress;',
        'tPosition += aCentroid;',
        'tPosition += cubicBezier(tPosition, aControl0, aControl1, aEndPosition, tProgress);',
        'transformed = tPosition;'

        // 'vec3 tPosition = transformed;',
        // 'tPosition *= 1.0 - tProgress;',
        // 'tPosition += cubicBezier(transformed, aControl0, aControl1, aEndPosition, tProgress);',
        // 'tPosition += mix(transformed, aEndPosition, tProgress);',
        // 'transformed = tPosition;'
      ]
    }, { })

    material.fragmentShader = material.fragmentShader.replace('gl_FragColor = vec4(1)', 'gl_FragColor = vec4(1.0,0.0,1.0,1.0)')
    material.needsUpdate = true
    super(bufferGeometry, material)
    this.animationDuration = maxDelayX + maxDelayY + maxDuration - 3
    this._animationProgress = 1
    this.frustumCulled = false
  }

  get animationProgress () {
    return this._animationProgress
  }

  set animationProgress (v) {
    this._animationProgress = v
    this.material.uniforms.uTime.value = this._animationProgress * v
  }
}
export default (engine:any) => {
  const utilGeo = new MGeometry()
  const geometry:THREE.TextGeometry = generateTextGeometry('UP IN SMOKE')

  // bas 处理
  utilGeo.userData = geometry.userData
  utilGeo.fromBufferGeometry(geometry)

  BAS.Utils.separateFaces(utilGeo)
  // geometry = utilGeo.toBufferGeometry() as THREE.TextGeometry

  const m = new TextAnimation(utilGeo)
  m.position.x = 4

  engine.add(m)

  const tl = new TimelineMax({
    repeat: -1,
    repeatDelay: 0.25,
    yoyo: true
  })
  tl.fromTo(m, 4, { animationProgress: 0.0 }, {
    animationProgress: 1.0,
    ease: Power1.easeInOut
  }, 0)
}
