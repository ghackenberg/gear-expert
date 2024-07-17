import * as React from 'react'
import * as THREE from 'three'

import { createGear } from './util'

export function Gear(props: { teeth: 10 | 20 | 30, onDragStart: React.DragEventHandler<HTMLDivElement> }) {

    const canvasRef = React.createRef<HTMLDivElement>()

    // States

    const [ambient] = React.useState(new THREE.AmbientLight())
    const [point] = React.useState(new THREE.PointLight())
    const [lights] = React.useState(new THREE.Group())
    const [gears] = React.useState(new THREE.Group())
    const [scene] = React.useState(new THREE.Scene())
    const [camera] = React.useState(new THREE.PerspectiveCamera())
    const [renderer] = React.useState(new THREE.WebGLRenderer({ alpha: true, antialias: true }))

    // Effects

    React.useEffect(() => {

        // Lights

        ambient.color.set('white')
        ambient.intensity = 0.5

        point.position.set(0.3, 0.3, 0.3)
        point.color.set('white')
        point.intensity = 1

        lights.add(ambient, point)

        // Gears

        gears.add(createGear(props.teeth, 'plain', 0, 0, 0, 0, 0, 1, 1, 1, 'gear'))

        // Scene

        scene.add(lights, gears)

        // Camera

        camera.position.set(0, 0.12, 0.06)
        camera.lookAt(0, 0, 0)

        // Renderer

        canvasRef.current.appendChild(renderer.domElement)

        setTimeout(onResize, 0)

        // Loop and resize

        renderer.setClearColor(0xffffff, 0)
        renderer.setAnimationLoop(onFrame)

        window.addEventListener('resize', onResize)

        return () => {
            renderer.setAnimationLoop(null)

            window.removeEventListener('resize', onResize)
        }
    }, [])

    // Functions

    function onResize() {
        camera.aspect = canvasRef.current.offsetWidth / canvasRef.current.offsetHeight
        camera.updateProjectionMatrix()

        renderer.setSize(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight)

        onFrame()
    }

    function onFrame() {
        for (const child of gears.children) {
            const { speed } = child.userData
            child.rotation.y += speed
        }

        renderer.render(scene ,camera)
    }

    // Return

    return <div ref={canvasRef} id={`${props.teeth}`} draggable onDragStart={props.onDragStart}/>
}