import * as THREE from 'three'

export default (engine:any) => {
  const geometry1 = new THREE.BoxGeometry(1, 1, 1)
  const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry1, material1)
  cube.position.z = 3
  engine.add(cube)
}
