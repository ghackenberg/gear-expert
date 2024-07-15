import * as React from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, useFrame, useLoader, Vector3 } from '@react-three/fiber'

function PlainGear10(props: { position: Vector3, angle: number, speed: number }) {
    const model = useLoader(GLTFLoader, 'models/plain/gear10.gltf')

    const [angle, setAngle] = React.useState(props.angle)

    useFrame(() => setAngle(angle + props.speed))

    return <primitive {...props} rotation={[0,angle,0]} object={model.scene}/>
}

function PlainGear20(props: { position: Vector3, angle: number, speed: number }) {
    const model = useLoader(GLTFLoader, 'models/plain/gear20.gltf')

    const [angle, setAngle] = React.useState(props.angle)

    useFrame(() => setAngle(angle + props.speed))

    return <primitive {...props} rotation={[0,angle,0]} object={model.scene}/>
}

function PlainGear30(props: { position: Vector3, angle: number, speed: number }) {
    const model = useLoader(GLTFLoader, 'models/plain/gear30.gltf')

    const [angle, setAngle] = React.useState(props.angle)

    useFrame(() => setAngle(angle + props.speed))

    return <primitive {...props} rotation={[0,angle,0]} object={model.scene}/>
}

export function Index() {
    const animate = true

    const angle1 = 0
    const angle2 = Math.PI * 2 / 40
    const angle3 = 0

    const speed1 = animate ? 0.04 : 0
    const speed2 = animate ? -speed1 * 10 / 20 : 0
    const speed3 = animate ? -speed2 * 20 / 30 : 0
    
    return (
        <Canvas orthographic camera={{ zoom: 3000, position: [0, 0.15, 0] }}>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <axesHelper args={[5]}/>
            <gridHelper args={[1, 100, 'teal', 'teal']}/>
            <PlainGear10 position={[-0.05, 0, 0]} angle={angle1} speed={speed1}/>
            <PlainGear20 position={[-0.02, 0, 0]} angle={angle2} speed={speed2}/>
            <PlainGear30 position={[+0.03, 0, 0]} angle={angle3} speed={speed3}/>
        </Canvas>
    )
}