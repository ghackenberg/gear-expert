import * as React from 'react'
import * as THREE from 'three'
import { choose, createGear, round } from './util'

export function World() {

    const ref = React.createRef<HTMLDivElement>()

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

    // States

    const [ambient] = React.useState(new THREE.AmbientLight())
    const [point] = React.useState(new THREE.PointLight())
    const [dummy10] = React.useState(createGear(10, 'plain', 0, 0, 0, 0, 0, 1, 1, 1))
    const [dummy20] = React.useState(createGear(20, 'plain', 0, 0, 0, 0, 0, 1, 1, 1))
    const [dummy30] = React.useState(createGear(30, 'plain', 0, 0, 0, 0, 0, 1, 1, 1))
    const [scene] = React.useState(new THREE.Scene())
    const [camera] = React.useState(new THREE.PerspectiveCamera())
    const [renderer] = React.useState(new THREE.WebGLRenderer())
    const [raycaster] = React.useState(new THREE.Raycaster())

    // Effects

    React.useEffect(() => {
        ambient.color.set('white')
        ambient.intensity = 0.5

        point.position.set(0.3, 0.3, 0.3)
        point.color.set('white')
        point.intensity = 1

        const grid = new THREE.GridHelper(1, 100)

        const gear10 = createGear(10, 'shaft', x1, 0, 0, angle1, speed1, Math.random(), Math.random(), Math.random())
        const gear20 = createGear(20, 'shaft', x2, 0, 0, angle2, speed2, Math.random(), Math.random(), Math.random())
        const gear30 = createGear(30, 'shaft', x3, 0, 0, angle3, speed3, Math.random(), Math.random(), Math.random())

        dummy10.visible = false
        dummy20.visible = false
        dummy30.visible = false

        scene.add(ambient, point)
        scene.add(grid)
        scene.add(dummy10, dummy20, dummy30)
        scene.add(gear10, gear20, gear30)
        scene.background = new THREE.Color('white')
        scene.userData.next = choose()

        camera.position.set(0, 0.2, 0.1)
        camera.lookAt(0, 0, 0)

        ref.current.appendChild(renderer.domElement)

        onResize()

        renderer.setAnimationLoop(onFrame)

        window.addEventListener('resize', onResize)

        return () => {
            renderer.setAnimationLoop(null)

            window.removeEventListener('resize', onResize)
        }
    }, [])

    // Functions

    function onResize() {
        camera.aspect = ref.current.offsetWidth / ref.current.offsetHeight
        camera.updateProjectionMatrix()

        renderer.setSize(ref.current.offsetWidth, ref.current.offsetHeight)

        onFrame()
    }

    function onFrame() {
        for (const child of scene.children) {
            if (child.userData.speed) {
                const { speed } = child.userData
                child.rotation.y += speed
            }
        }

        renderer.render(scene ,camera)
    }

    function locate(event: React.MouseEvent<HTMLDivElement>, y = 0) {
        const x = +((event.pageX - ref.current.offsetLeft)  / ref.current.offsetWidth) * 2 - 1
        const z = -((event.pageY - ref.current.offsetTop) / ref.current.offsetHeight) * 2 + 1

        const mouse = new THREE.Vector2(x, z)

        raycaster.setFromCamera(mouse, camera)

        const origin = raycaster.ray.origin
        const direction = raycaster.ray.direction
        const distance = (y - origin.y) / direction.y
        const position = origin.add(direction.multiplyScalar(distance))

        position.x = round(position.x)
        position.z = round(position.z)

        return position
    }

    function onMouseOver(event: React.MouseEvent<HTMLDivElement>) {
        const position = locate(event)

        const next = scene.userData.next

        if (next == 10) {
            dummy10.visible = true
            dummy10.position.copy(position)
        } else if (next == 20) {
            dummy20.visible = true
            dummy20.position.copy(position)
        } else if (next == 30) {
            dummy30.visible = true
            dummy30.position.copy(position)
        }
    }

    function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const position = locate(event)

        const next = scene.userData.next

        if (next == 10) {
            dummy10.visible = true
            dummy10.position.copy(position)
        } else if (next == 20) {
            dummy20.visible = true
            dummy20.position.copy(position)
        } else if (next == 30) {
            dummy30.visible = true
            dummy30.position.copy(position)
        }
    }

    function onClick(event: React.MouseEvent<HTMLDivElement>) {
        const position = locate(event)

        const next = scene.userData.next

        const gear = createGear(next, 'shaft', position.x, position.y, position.z, 0, 0.01, Math.random(), Math.random(), Math.random())

        scene.add(gear)

        if (next == 10) {
            dummy10.visible = false
        } else if (next == 20) {
            dummy20.visible = false
        } else if (next == 30) {
            dummy30.visible = false
        }

        scene.userData.next = choose()

        onFrame()
    }

    function onMouseOut(event: React.MouseEvent<HTMLDivElement>) {
        const next = scene.userData.next

        if (next == 10) {
            dummy10.visible = false
        } else if (next == 20) {
            dummy20.visible = false
        } else if (next == 30) {
            dummy30.visible = false
        }
    }

    // Return
    
    return <div ref={ref} style={{width: '100%', height: '100%'}} onMouseOver={onMouseOver} onMouseMove={onMouseMove} onClick={onClick} onMouseOut={onMouseOut}/>

}