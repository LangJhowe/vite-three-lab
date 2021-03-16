import * as THREE from 'three'

class MyGeo extends THREE.BufferGeometry {
  modelGeometry:THREE.BufferGeometry
  vertexCount: number
  faceCount: number
  faces:THREE.Triangle[]

  constructor (model:THREE.BufferGeometry) {
    super()
    this.copy(model)
    this.modelGeometry = model
    this.vertexCount = this.modelGeometry.attributes.position.count
    this.faceCount = this.vertexCount / 3
    this.faces = []

    // 计算面数组
    const v1 = new THREE.Vector3()
    const v2 = new THREE.Vector3()
    const v3 = new THREE.Vector3()
    const pos = this.modelGeometry.attributes.position
    for (let i = 0; i < this.vertexCount; i += 3) {
      v1.fromBufferAttribute(pos, i)
      v2.fromBufferAttribute(pos, i + 1)
      v3.fromBufferAttribute(pos, i + 2)
      const face = new THREE.Triangle(v1.clone(), v2.clone(), v3.clone())
      this.faces.push(face)
    }

    this.bufferPositions() // 缓存positions
  }

  bufferPositions ():void {
    // const positionBuffer = this.createAttribute('position', 3).array
    // console.log(positionBuffer)
  }

  createAttribute (name:string, itemSize:number) {
    const buffer = new Float32Array(this.vertexCount * itemSize)
    const attribute = new THREE.BufferAttribute(buffer, itemSize)

    this.setAttribute(name, attribute)

    return attribute
  }
}
class MyMaterial extends THREE.ShaderMaterial {
  shaderFunctions:string[]
  shaderParameters:string[]
  shaderVertexInit:string[]
  shaderTransformNormal:string[]
  shaderTransformPosition:string[]
  constructor (params:Record<string, any>) {
    super()
    this.shaderFunctions = params.shaderFunctions
    this.shaderParameters = params.shaderParameters
    this.shaderVertexInit = params.shaderVertexInit
    this.shaderTransformNormal = params.shaderTransformNormal
    this.shaderTransformPosition = params.shaderTransformPosition

    // const basicShader = THREE.ShaderLib.basic
    this.vertexShader = this._concatVertexShader()
    const color = new THREE.Color(params.color)
    this.fragmentShader = `
      void main() {
        gl_FragColor = vec4(${color.r},${color.g},${color.b},1.0);
      }
    `
    // basicShader.fragmentShader
    this.setValues({ uniforms: params.uniforms })
    this.uniformsNeedUpdate = true
  }

  _concatFunctions () {
    return this.shaderFunctions.join('\n')
  }

  _concatParameters () {
    return this.shaderParameters.join('\n')
  }

  _concatVertexInit () {
    return this.shaderVertexInit.join('\n')
  }

  _concatTransformNormal () {
    return this.shaderTransformNormal.join('\n')
  };

  _concatTransformPosition () {
    return this.shaderTransformPosition.join('\n')
  }

  _concatVertexShader () {
  // based on THREE.ShaderLib.phong
    return [
      THREE.ShaderChunk.common,
      THREE.ShaderChunk.uv_pars_vertex,
      THREE.ShaderChunk.uv2_pars_vertex,
      THREE.ShaderChunk.envmap_pars_vertex,
      THREE.ShaderChunk.color_pars_vertex,
      THREE.ShaderChunk.morphtarget_pars_vertex,
      THREE.ShaderChunk.skinning_pars_vertex,
      THREE.ShaderChunk.logdepthbuf_pars_vertex,

      this._concatFunctions(),

      this._concatParameters(),

      'void main() {',

      this._concatVertexInit(),

      THREE.ShaderChunk.uv_vertex,
      THREE.ShaderChunk.uv2_vertex,
      THREE.ShaderChunk.color_vertex,
      THREE.ShaderChunk.skinbase_vertex,

      ' #ifdef USE_ENVMAP',

      THREE.ShaderChunk.beginnormal_vertex,

      this._concatTransformNormal(),

      THREE.ShaderChunk.morphnormal_vertex,
      THREE.ShaderChunk.skinnormal_vertex,
      THREE.ShaderChunk.defaultnormal_vertex,

      ' #endif',

      THREE.ShaderChunk.begin_vertex,

      this._concatTransformPosition(),

      THREE.ShaderChunk.morphtarget_vertex,
      THREE.ShaderChunk.skinning_vertex,
      THREE.ShaderChunk.project_vertex,
      THREE.ShaderChunk.logdepthbuf_vertex,

      THREE.ShaderChunk.worldpos_vertex,
      THREE.ShaderChunk.envmap_vertex,

      '}'

    ].join('\n')
  };
}
export {
  MyGeo,
  MyMaterial
}
