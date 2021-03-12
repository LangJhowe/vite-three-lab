
import { Power1, Power3, TimelineMax, Back } from 'gsap/gsap-core'
import * as THREE from 'three'

export default (engine:any) => {
// Create a new cube with simple geometry & material
  const geometry = new THREE.BoxGeometry(15, 15, 15)
  const texture = new THREE.MeshBasicMaterial()
  const cube = new THREE.Mesh(geometry, texture)

  // Create a new timeline
  // I like to add my timeline to my element object so I know to which element it refers to
  // But we could declare a new variable which contains the timeline
  const tl = new TimelineMax({
    repeat: -1,
    repeatDelay: 1
  })
  // I add a few animations in my timeline
  // The cube turn on itself
  tl.to(cube.rotation, 3, {
    y: -Math.PI * 3.25,
    x: -Math.PI * 1.25,
    ease: Back.easeInOut
  })

  // Then it will move to the left and fade out
  tl.to(cube.position, 1, {
    x: -150,
    ease: Power3.easeOut
  })
  tl.to(cube.material, 1, {
    opacity: 0,
    ease: Power3.easeOut
  }, '-=1')

  // Move the cube without transition
  tl.set(cube.position, {
    x: 100,
    y: -100
  })

  // Fade In the cube
  tl.to(cube.material, 1, {
    opacity: 1,
    ease: Power3.easeOut
  })

  // It goes back to its initial position
  tl.to(cube.position, 3, {
    x: 0,
    y: 0,
    ease: Back.easeInOut.config(2)
  })
  tl.to(cube.rotation, 3, {
    x: 0,
    y: 0,
    ease: Back.easeInOut.config(2)
  }, '-=3')

  // Add the cube in the scene
  engine.add(cube)
}
