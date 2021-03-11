import * as THREE from 'three'

export default (engine:any) => {
  // 灯光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(-4, 8, 4)
  const dhelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000)

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.4)
  hemisphereLight.position.set(0, 8, 0)
  const hHelper = new THREE.HemisphereLightHelper(hemisphereLight, 5)

  engine.add(directionalLight)
  engine.add(hemisphereLight)
  engine.add(dhelper)
  engine.add(hHelper)
}
