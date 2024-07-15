import * as React from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Canvas, useFrame, useLoader, Vector3 } from '@react-three/fiber'

function PlainGear10(props: { position: Vector3 }) {
    const model = useLoader(GLTFLoader, 'models/plain/gear10.gltf')

    const [angle, setAngle] = React.useState(0)

    useFrame(() => setAngle(angle + 0.01))

    return <primitive {...props} rotation={[0,angle,0]} object={model.scene}/>
}

function PlainGear20(props: { position: Vector3 }) {
    const model = useLoader(GLTFLoader, 'models/plain/gear20.gltf')

    const [angle, setAngle] = React.useState(0)

    useFrame(() => setAngle(angle + 0.01))

    return <primitive {...props} rotation={[0,angle,0]} object={model.scene}/>
}

function PlainGear30(props: { position: Vector3 }) {
    const model = useLoader(GLTFLoader, 'models/plain/gear30.gltf')

    const [angle, setAngle] = React.useState(0)

    useFrame(() => setAngle(angle + 0.01))

    return <primitive {...props} rotation={[0,angle,0]} object={model.scene}/>
}

export function Index() {
    return (
        <Canvas orthographic camera={{ zoom: 3000, position: [0, 0.15, 0] }}>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <axesHelper args={[5]}/>
            <gridHelper args={[10, 600, 'teal', 'teal']}/>
            <PlainGear10 position={[-0.1, 0, 0]}/>
            <PlainGear20 position={[   0, 0, 0]}/>
            <PlainGear30 position={[+0.1, 0, 0]}/>
        </Canvas>
    )
}