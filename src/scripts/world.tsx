import * as React from 'react'
import * as THREE from 'three'
import { createGear, round } from './util'

export function World() {

    const canvasRef = React.createRef<HTMLDivElement>()

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
    const [lights] = React.useState(new THREE.Group())
    const [dummies] = React.useState(new THREE.Group())
    const [gears] = React.useState(new THREE.Group())
    const [scene] = React.useState(new THREE.Scene())
    const [camera] = React.useState(new THREE.PerspectiveCamera())
    const [renderer] = React.useState(new THREE.WebGLRenderer())
    const [raycaster] = React.useState(new THREE.Raycaster())

    // Effects

    React.useEffect(() => {

        // Grid

        const grid = new THREE.GridHelper(1, 100)

        // Lights

        ambient.color.set('white')
        ambient.intensity = 0.5

        point.position.set(0.3, 0.3, 0.3)
        point.color.set('white')
        point.intensity = 1

        lights.add(ambient, point)

        // Dummies

        const dummy0 = createGear(10, 'plain', 0, 0, 0, 0, 0, 1, 1, 1, '10')
        dummy0.visible = false

        const dummy1 = createGear(20, 'plain', 0, 0, 0, 0, 0, 1, 1, 1, '20')
        dummy1.visible = false

        const dummy2 = createGear(30, 'plain', 0, 0, 0, 0, 0, 1, 1, 1, '30')
        dummy2.visible = false

        dummies.add(dummy0, dummy1, dummy2)

        // Gears

        const gear10 = createGear(10, 'shaft', x1, 0, 0, angle1, speed1, Math.random(), Math.random(), Math.random(), '0')
        const gear20 = createGear(20, 'shaft', x2, 0, 0, angle2, speed2, Math.random(), Math.random(), Math.random(), '1')
        const gear30 = createGear(30, 'shaft', x3, 0, 0, angle3, speed3, Math.random(), Math.random(), Math.random(), '2')

        gears.userData.count = 3
        gears.add(gear10, gear20, gear30)

        // Scene

        scene.add(grid, lights, dummies, gears)
        scene.background = new THREE.Color('white')

        // Camera

        camera.position.set(0, 0.2, 0.1)
        camera.lookAt(0, 0, 0)

        // Renderer

        canvasRef.current.appendChild(renderer.domElement)

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

    function locate(event: React.MouseEvent<HTMLDivElement>, y = 0) {
        const x = +((event.pageX - canvasRef.current.offsetLeft)  / canvasRef.current.offsetWidth) * 2 - 1
        const z = -((event.pageY - canvasRef.current.offsetTop) / canvasRef.current.offsetHeight) * 2 + 1

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

    function intersect(event: React.MouseEvent<HTMLDivElement>) {
        const x = +((event.pageX - canvasRef.current.offsetLeft)  / canvasRef.current.offsetWidth) * 2 - 1
        const z = -((event.pageY - canvasRef.current.offsetTop) / canvasRef.current.offsetHeight) * 2 + 1

        const mouse = new THREE.Vector2(x, z)

        raycaster.setFromCamera(mouse, camera)

        const intersections = raycaster.intersectObjects(gears.children, true)

        if (intersections.length > 0) {
            return intersections[0].object
        } else {
            return null
        }
    }

    function onDragStartPaletteItem(event: React.DragEvent<HTMLDivElement>) {
        scene.userData.action = 'create'
        scene.userData.name = event.currentTarget.id
        event.currentTarget.style.background = 'gray'
        event.dataTransfer.setDragImage(document.createElement('div'), 0, 0)
    }

    function onDragOverPalette(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        const action = scene.userData.action
        const name = scene.userData.name
        if (action == 'create') {
            // Hide dummy
            const dummy = dummies.getObjectByName(name)
            dummy.visible = false
        } else if (action == 'update') {
            // Position gear
            const gear = gears.getObjectByName(name)
            gear.position.copy(scene.userData.position)
        }
    }

    function onDropPalette(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        const action = scene.userData.action
        const name = scene.userData.name
        if (action == 'create') {
            document.getElementById(name).style.background = 'lightgray'
        }
    }

    function onDragStartCanvas(event: React.DragEvent<HTMLDivElement>) {
        const gear = intersect(event)
        if (gear) {
            scene.userData.position = new THREE.Vector3().copy(gear.parent.parent.parent.position)
            scene.userData.action = 'update'
            scene.userData.name = gear.parent.parent.parent.name
            event.dataTransfer.setDragImage(document.createElement('div'), 0, 0)
        } else {
            event.preventDefault()
        }
    }

    function onDragOverCanvas(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        const position = locate(event)
        const action = scene.userData.action
        const name = scene.userData.name
        if (action == 'create') {
            // Show and position dummy
            const dummy = dummies.getObjectByName(name)
            dummy.visible = true
            dummies.position.copy(position)
        } else if (action == 'update') {
            // Show and position gearx
            const gear = gears.getObjectByName(name)
            gear.visible = true
            gear.position.copy(position)
        }
    }

    function onDropCanvas(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        const position = locate(event)
        const action = scene.userData.action
        const name = scene.userData.name
        if (action == 'create') {
            document.getElementById(name).style.background = 'lightgray'
            // Hide dummy
            const dummy = dummies.getObjectByName(name)
            dummy.visible = false
            // Add gear
            const gear = createGear(name, 'shaft', position.x, position.y, position.z, 0, (Math.random() - 0.5) / 50, Math.random(), Math.random(), Math.random(), `${gears.userData.count++}`)
            gears.add(gear)
        }
    }

    function onDragOverTrash(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        event.currentTarget.style.background = 'gray'
        const action = scene.userData.action
        const name = scene.userData.name
        if (action == 'create') {
            // Hide dummy
            const dummy = dummies.getObjectByName(name)
            dummy.visible = false
        } else if (action == 'update') {
            // Hide gear
            const gear = gears.getObjectByName(name)
            gear.visible = false
        }
    }

    function onDragLeaveTrash(event: React.DragEvent<HTMLDivElement>) {
        event.currentTarget.style.background = 'lightgray'
    }

    function onDropTrash(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        event.currentTarget.style.background = 'lightgray'
        const action = scene.userData.action
        const name = scene.userData.name
        if (action == 'create') {
            document.getElementById(name).style.background = 'lightgray'
        } else if (action == 'update') {
            // Remove gear
            const gear = gears.getObjectByName(name)
            gears.remove(gear)
        }
    }

    // Styles

    const canvasStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        userSelect: 'none'
    }
    const trashStyle: React.CSSProperties = {
        position: 'absolute',
        top: '1em',
        left: '1em',
        width: '7em',
        lineHeight: '7em',
        textAlign: 'center',
        background: 'lightgray',
        boxShadow: '0.25em 0.25em 1em rgba(0,0,0,0.5)',
        userSelect: 'none'
    }
    const paletteStyle: React.CSSProperties = {
        position: 'absolute',
        display: 'flex',
        gap: '0.25em',
        top: '1em',
        right: '1em',
        background: 'white',
        boxShadow: '0.25em 0.25em 1em rgba(0,0,0,0.5)',
        userSelect: 'none'
    }
    const paletteItemStyle: React.CSSProperties = {
        width: '7em',
        lineHeight: '7em',
        textAlign: 'center',
        background: 'lightgray',
        userSelect: 'none'
    }

    // Return
    
    return (
        <>
            <div id='canvas' ref={canvasRef} style={canvasStyle} draggable onDragStart={onDragStartCanvas} onDragOver={onDragOverCanvas} onDrop={onDropCanvas}>
                {/*Empty*/}
            </div>
            <div id='trash' style={trashStyle} onDragOver={onDragOverTrash} onDragLeave={onDragLeaveTrash} onDrop={onDropTrash}>Trash</div>
            <div id='palette' style={paletteStyle} onDragOver={onDragOverPalette} onDrop={onDropPalette}>
                <div id='10' style={paletteItemStyle} draggable onDragStart={onDragStartPaletteItem}>Gear 10</div>
                <div id='20' style={paletteItemStyle} draggable onDragStart={onDragStartPaletteItem}>Gear 20</div>
                <div id='30' style={paletteItemStyle} draggable onDragStart={onDragStartPaletteItem}>Gear 30</div>
            </div>
        </>
    )

}