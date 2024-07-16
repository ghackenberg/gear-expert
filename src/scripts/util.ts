import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTFLoader()

export function createGear(teeth: number, style: 'plain' | 'shaft', x: number, y: number, z: number, angle: number, speed: number, r: number, g: number, b: number, name: string) {
    const group = new THREE.Group()
    group.name = name
    group.position.x = x
    group.position.y = y
    group.position.z = z
    group.rotation.y = angle
    group.userData = { teeth, style, x, y, z, angle, speed, r, g, b }

    loader.loadAsync(`models/${style}/gear${teeth}.gltf`).then(model => {
        model.scene.position.y = -0.005
        
        for (const parent of model.scene.children) {
            for (const child of parent.children) {
                const mesh = child as THREE.Mesh

                const material  = mesh.material as THREE.MeshStandardMaterial
                material.color.r = r
                material.color.g = g
                material.color.b = b
            }
        }

        group.add(model.scene)
    })

    return group
}

export function round(value: number) {
    return Math.round(value * 100) / 100
}

export function snap(original: THREE.Vector3) {
    const clone = original.clone()

    clone.x = round(clone.x)
    clone.z = round(clone.z)

    return clone
}