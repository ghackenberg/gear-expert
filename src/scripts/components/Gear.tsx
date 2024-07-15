import * as React from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useFrame, useLoader, Vector3 } from '@react-three/fiber'

export type GearProps = { teeth: number, style: 'plain' | 'shaft', position: Vector3, angle: number, speed: number } 

export function Gear(props: GearProps) {
    const model = useLoader(GLTFLoader, `models/${props.style}/gear${props.teeth}.gltf`)

    const [angle, setAngle] = React.useState(props.angle)

    useFrame(() => setAngle(angle + props.speed))

    return <primitive {...props} rotation={[0,angle,0]} object={model.scene.clone(true)}/>
}