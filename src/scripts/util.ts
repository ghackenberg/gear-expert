import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import * as GearPlain10 from '../models/plain/gear10.glb'
import * as GearPlain20 from '../models/plain/gear20.glb'
import * as GearPlain30 from '../models/plain/gear30.glb'

import * as GearShaft10 from '../models/shaft/gear10.glb'
import * as GearShaft20 from '../models/shaft/gear20.glb'
import * as GearShaft30 from '../models/shaft/gear30.glb'

const models = {
    'plain': {
        10: GearPlain10,
        20: GearPlain20,
        30: GearPlain30
    },
    'shaft': {
        10: GearShaft10,
        20: GearShaft20,
        30: GearShaft30
    }
}

const loader = new GLTFLoader()

export function createGear(teeth: 10 | 20 | 30, style: 'plain' | 'shaft', x: number, y: number, z: number, angle: number, speed: number, r: number, g: number, b: number, name: string) {
    const group = new THREE.Group()
    group.name = name
    group.position.x = x
    group.position.y = y
    group.position.z = z
    group.rotation.y = angle
    group.userData = { teeth, style, x, y, z, angle, speed, r, g, b }

    loader.loadAsync(models[style][teeth]).then(model => {
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