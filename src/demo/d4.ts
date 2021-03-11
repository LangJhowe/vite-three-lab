import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
export default (engine:any) => {
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/examples/js/libs/draco/')
  loader.setDRACOLoader(dracoLoader)
  loader.load(
    // resource URL
    'src/assets/three/gltf/monkey.gltf',
    // 'src/assets/three/gltf/stroke.gltf',
    // called when the resource is loaded
    function (gltf) {
      const axesHelper = new THREE.AxesHelper(5)
      gltf.scene.add(axesHelper)
      const targetMesh = gltf.scene.children[0] as THREE.Mesh
      targetMesh.position.x = 3
      engine.add(targetMesh)
      console.log(targetMesh)

      // gltf.animations // Array<THREE.AnimationClip>
      // gltf.scene // THREE.Group
      // gltf.scenes // Array<THREE.Group>
      // gltf.cameras // Array<THREE.Camera>
      // gltf.asset // Object
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    // called when loading has errors
    function (error) { // eslint-disable-line
      console.log('An error happened')
    }
  )

  // instantiate a loader
  const objLoader = new OBJLoader()

  // load a resource
  objLoader.load(
    // resource URL
    'src/assets/three/gltf/lamborghini.obj',
    // 'src/assets/three/gltf/stroke.obj',

    // called when resource is loaded
    function (object) {
      const targret = object.children[0]
      targret.position.x = -15

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

      // 粒子
      const material = new THREE.PointsMaterial({
        color: '#0468ec',
        size: 1,
        opacity: 1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        map: generateSprite()
      })
      const target2 = targret.clone() as THREE.Mesh

      const mesh = new THREE.Points(target2.geometry, material)
      mesh.position.x = 15
      // mesh.scale.set(0.1, 0.1, 0.1) // scale
      engine.add(mesh)
      engine.add(targret)
    },
    // called when loading is in progresses
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    // called when loading has errors
    function (error) {// eslint-disable-line
      console.log('An error happened')
    }
  )
}
