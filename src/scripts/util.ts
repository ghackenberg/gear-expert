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

const factor = 0.05

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
        const faceRoot = model.scene
        const wireRoot = new THREE.Group()
        
        for (const faceParent of faceRoot.children) {

            // Wire parent

            const wireParent = new THREE.Group()
            wireParent.position.copy(faceParent.position)
            wireParent.rotation.copy(faceParent.rotation)

            for (const faceChild of faceParent.children) {

                // Face child

                const faceChildMsh = faceChild as THREE.Mesh

                const faceChildMat  = faceChildMsh.material as THREE.MeshStandardMaterial
                faceChildMat.polygonOffset = true
                faceChildMat.polygonOffsetFactor = 1
                faceChildMat.polygonOffsetUnits = 1
                faceChildMat.color.r = r
                faceChildMat.color.g = g
                faceChildMat.color.b = b

                // Wire child

                const wireChildGeo = new THREE.EdgesGeometry(faceChildMsh.geometry.clone(), 90)

                const wireChildMat = new THREE.LineBasicMaterial()
                wireChildMat.color.r = r * factor
                wireChildMat.color.g = g * factor
                wireChildMat.color.b = b * factor

                const wireChildSgm = new THREE.LineSegments(wireChildGeo, wireChildMat)
                wireChildSgm.position.copy(faceChildMsh.position)
                wireChildSgm.rotation.copy(faceChildMsh.rotation)

                wireParent.add(wireChildSgm)

            }

            wireRoot.add(wireParent)
        }

        group.add(faceRoot)
        group.add(wireRoot)
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