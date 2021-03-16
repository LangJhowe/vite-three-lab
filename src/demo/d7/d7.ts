import * as THREE from 'three'

import fontJson from '@/assets/three/font/Cyberpunk_Regular.json'
import { Power1, TimelineMax } from 'gsap/gsap-core'
import { MyGeo, MyMaterial } from './my'

function computeCentroid (face:THREE.Triangle):THREE.Vector3 {
  const v = new THREE.Vector3()
  const a = face.a
  const b = face.b
  const c = face.c
  v.x = (a.x + b.x + c.x) / 3
  v.y = (a.y + b.y + c.y) / 3
  v.z = (a.z + b.z + c.z) / 3
  return v
}
const ShaderChunk = {
  cubic_bezier: 'vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t)\n{\n    vec3 tp;\n    float tn = 1.0 - t;\n\n    tp.xyz = tn * tn * tn * p0.xyz + 3.0 * tn * tn * t * c0.xyz + 3.0 * tn * t * t * c1.xyz + t * t * t * p1.xyz;\n\n    return tp;\n}\n',
  ease_out_cubic: 'float ease(float t, float b, float c, float d) {\n  return c*((t=t/d - 1.0)*t*t + 1.0) + b;\n}\n'
}
export default (engine:any) => {
  engine.camera.far = 20
  engine.camera.position.x = 0// = 10
  engine.camera.position.y = 6// = 10
  engine.camera.position.z = 15
  const fontLader = new THREE.FontLoader()
  const params = {
    size: 1,
    height: 0,
    font: fontLader.parse(fontJson),
    // weight: 'bold',
    // style: 'normal',
    // bevelSize: 0.75,
    // bevelThickness: 0.01,
    // bevelEnabled: true,
    anchor: {
      x: 0.5,
      y: -0.5,
      z: 0.5
    }
  }

  // const geometry = new THREE.TextGeometry('Jhowe', params)
  const geometry = new MyGeo(new THREE.TextGeometry('UP IN SMOKE', params))
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

  const size = geometry.userData.size

  const maxDelayX = 0.2// 控制横向变化延迟
  const maxDelayY = 0.1// 控制纵向变化延迟
  const minDuration = 0.3
  const maxDuration = 0.5
  const stretch = 0.1 // 变形拉伸
  // 线条
  geometry.createAttribute('aOffset', 3)
  geometry.createAttribute('aAnimation', 2)
  geometry.createAttribute('aCentroid', 3)
  geometry.createAttribute('aControl0', 3)
  geometry.createAttribute('aControl1', 3)
  geometry.createAttribute('aEndPosition', 3)
  const aOffset = new Float32Array(geometry.vertexCount * 3)
  const aAnimation = new Float32Array(geometry.vertexCount * 2)
  const aCentroid = new Float32Array(geometry.vertexCount * 3)
  const aControl0 = new Float32Array(geometry.vertexCount * 3)
  const aControl1 = new Float32Array(geometry.vertexCount * 3)
  const aEndPosition = new Float32Array(geometry.vertexCount * 3)

  for (let i = 0, i2 = 0, vi = 0, ci = 0; i < geometry.faceCount; i++, i2 += 6, vi += 9, ci += 9) {
    const face = geometry.faces[i]
    const centroid = computeCentroid(face) // 通过geomerty的定点和面计算质心

    for (let v = 0; v < 9; v += 3) {
      aOffset[vi + v] = THREE.MathUtils.randFloat(2, 6)
      aOffset[vi + v + 1] = THREE.MathUtils.randFloat(8, 11)
      aOffset[vi + v + 2] = THREE.MathUtils.randFloat(0.1, 0.4)
    }

    // animation
    const delayX = Math.max(0, (centroid.x / size.width) * maxDelayX)
    const delayY = Math.max(0, (1.0 - (centroid.y / size.height)) * maxDelayY)
    const duration = THREE.MathUtils.randFloat(minDuration, maxDuration)

    for (let v = 0; v < 6; v += 2) {
      aAnimation[i2 + v] = (delayX + delayY + Math.random() * stretch)
      aAnimation[i2 + v + 1] = duration
    }

    // centroid
    for (let v = 0; v < 9; v += 3) {
      aCentroid[ci + v] = centroid.x
      aCentroid[ci + v + 1] = centroid.y
      aCentroid[ci + v + 2] = centroid.z
    }

    // ctrl
    const c0x = centroid.x + size.width / 2 + THREE.MathUtils.randFloat(1, 2)
    const c0y = centroid.y + size.height * THREE.MathUtils.randFloat(2.0, 3.0)
    const c0z = THREE.MathUtils.randFloatSpread(10)

    const c1x = centroid.x + size.width / 2 + THREE.MathUtils.randFloat(1, 6) * -1
    const c1y = centroid.y + size.height * THREE.MathUtils.randFloat(3.0, 6.0)
    const c1z = THREE.MathUtils.randFloatSpread(10)

    for (let v = 0; v < 9; v += 3) {
      aControl0[ci + v] = c0x
      aControl0[ci + v + 1] = c0y
      aControl0[ci + v + 2] = c0z

      aControl1[ci + v] = c1x
      aControl1[ci + v + 1] = c1y
      aControl1[ci + v + 2] = c1z
    }

    // end position
    var x, y, z

    x = centroid.x + THREE.MathUtils.randFloatSpread(3) - size.width / 2
    y = centroid.y + size.height * THREE.MathUtils.randFloat(0, 6)
    z = -10// THREE.MathUtils.randFloat(-10, 10)

    for (let v = 0; v < 9; v += 3) {
      aEndPosition[ci + v] = x
      aEndPosition[ci + v + 1] = y
      aEndPosition[ci + v + 2] = z
    }
  }

  geometry.setAttribute('aOffset', new THREE.BufferAttribute(aOffset, 3))
  geometry.setAttribute('aCentroid', new THREE.BufferAttribute(aCentroid, 3))
  geometry.setAttribute('aControl0', new THREE.BufferAttribute(aControl0, 3))
  geometry.setAttribute('aControl1', new THREE.BufferAttribute(aControl1, 3))
  geometry.setAttribute('aAnimation', new THREE.BufferAttribute(aAnimation, 2))
  geometry.setAttribute('aEndPosition', new THREE.BufferAttribute(aEndPosition, 3))

  const material = new MyMaterial({
    uniforms: { uTime: { value: 0 } },
    color: '#E7F20D',
    shaderFunctions: [
      ShaderChunk.cubic_bezier,
      ShaderChunk.ease_out_cubic
    ],
    shaderParameters: [
      'uniform float uTime;',
      'attribute vec3 aOffset;',
      'attribute vec2 aAnimation;',
      'attribute vec3 aCentroid;',
      'attribute vec3 aControl0;',
      'attribute vec3 aControl1;',
      'attribute vec3 aEndPosition;'
    ],
    shaderVertexInit: [
      'float mTime = 1.0;',
      'vec3 endPosition = vec3(-3.0,3.0,-3.0);',
      'float tDelay = aAnimation.x;',
      'float tDuration = aAnimation.y;',
      'float tTime = clamp(uTime-tDelay, 0.0, tDuration);',

      'float tProgress =  ease(tTime, 0.0, 1.0, tDuration);'

    ],
    shaderTransformNormal: [
    ],
    shaderTransformPosition: [
      // 简单平移
      // 'transformed.x=transformed.x + uTime*10.0;'

      // 变量uTime控制到endPosition距离(缩放)
      // 'vec3 tPosition = transformed - endPosition;',
      // 'transformed = tPosition*uTime;'

      // 三角形质点
      // 'vec3 tPosition = transformed - aCentroid;',
      // 'tPosition *= 1.0 - uTime;',
      // 'tPosition += aCentroid;',
      // 'tPosition += cubicBezier(tPosition, aControl0, aControl1, endPosition, tProgress);',
      // 'transformed= tPosition;'

      // 三角形质点 + 延迟
      'vec3 tPosition = transformed - aCentroid;',
      'tPosition *= (1.0 - tTime);',
      'tPosition += aCentroid;',
      'tPosition += cubicBezier(tPosition, aControl0, aControl1, aEndPosition, tProgress);',
      'transformed = tPosition;'
    ]

  })
  const m = new THREE.Mesh(geometry, material)
  engine.add(m)

  const tl = new TimelineMax({
    repeat: -1,
    repeatDelay: 0.25,
    yoyo: true
  })
  tl.fromTo(m.material.uniforms.uTime, { value: 0.0 }, {
    value: 1,
    duration: 4,
    ease: Power1.easeInOut
  })
}
