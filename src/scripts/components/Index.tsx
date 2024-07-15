import * as React from 'react'
import { Canvas } from '@react-three/fiber'
import { Gear, GearProps } from './Gear'

export function Index() {

    const module = 0.002

    const teeth1 = 10
    const teeth2 = 20
    const teeth3 = 30

    const diameter1 = teeth1 * module
    const diameter2 = teeth2 * module
    const diameter3 = teeth3 * module

    const x1 = -0.050
    const x2 = x1 + diameter1 / 2 + diameter2 / 2
    const x3 = x2 + diameter2 / 2 + diameter3 / 2

    const angle1 = 0
    const angle2 = Math.PI * 2 / teeth2 / 2
    const angle3 = 0

    const speed1 = 0.04
    const speed2 = -speed1 * teeth1 / teeth2
    const speed3 = -speed2 * teeth2 / teeth3

    const initialGears: GearProps[] = [
        { teeth: teeth1, style: 'plain', position: [x1, 0, 0], angle: angle1, speed: speed1 },
        { teeth: teeth2, style: 'plain', position: [x2, 0, 0], angle: angle2, speed: speed2 },
        { teeth: teeth3, style: 'plain', position: [x3, 0, 0], angle: angle3, speed: speed3 }
    ]

    const [gears, setGears] = React.useState(initialGears)

    function onPointerMissed(event: MouseEvent) {
        const x = (event.pageX / window.innerWidth - 0.5) * 2
        const y = (event.pageY / window.innerHeight - 0.5) * 2
        
        setGears([...gears, { teeth: 10, style: 'plain', position: [x / 10, 0, y / 20], angle: 0, speed: 0 }])
    }
    
    return (
        <Canvas orthographic camera={{ zoom: 5000, position: [0, 1, 0] }} onPointerMissed={onPointerMissed}>
            { /*Light*/ }
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            { /*Helper*/ }
            <gridHelper args={[1, 100, 'red', 'teal']}/>
            { /*Gear*/ }
            { gears.map((gear, index) => <Gear key={index} {...gear}/>) }
        </Canvas>
    )

}