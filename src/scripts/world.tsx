import * as React from 'react'
import * as THREE from 'three'
import { createGear, round } from './util'
import { Gear } from './gear'

export function World() {

    const canvasRef = React.createRef<HTMLDivElement>()

    // States

    const [ambient] = React.useState(new THREE.AmbientLight())
    const [point] = React.useState(new THREE.PointLight())
    const [lights] = React.useState(new THREE.Group())
    const [dummies] = React.useState(new THREE.Group())
    const [gears] = React.useState(new THREE.Group())
    const [scene] = React.useState(new THREE.Scene())
    const [camera] = React.useState(new THREE.PerspectiveCamera())
    const [renderer] = React.useState(new THREE.WebGLRenderer({ antialias: true }))
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

        gears.userData.count = 0

        // Scene

        scene.add(grid, lights, dummies, gears)
        scene.background = new THREE.Color('white')

        // Camera

        camera.position.set(0, 0.2, 0.1)
        camera.lookAt(0, 0, 0)

        // Renderer

        canvasRef.current.appendChild(renderer.domElement)

        setTimeout(onResize, 0)

        // Loop and resize

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
        event.currentTarget.className = 'active'
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
            document.getElementById(name).className = undefined
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
            document.getElementById(name).className = 'undefined'
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
        event.currentTarget.className = 'hover'

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
        event.currentTarget.className = undefined
    }

    function onDropTrash(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        event.currentTarget.className = undefined

        const action = scene.userData.action
        const name = scene.userData.name

        if (action == 'create') {
            document.getElementById(name).className = undefined
        } else if (action == 'update') {
            // Remove gear
            const gear = gears.getObjectByName(name)
            gears.remove(gear)
        }
    }

    // Return
    
    return (
        <div id='world'>
            <div id='canvas' ref={canvasRef} draggable onDragStart={onDragStartCanvas} onDragOver={onDragOverCanvas} onDrop={onDropCanvas}/>
            <div id='trash' onDragOver={onDragOverTrash} onDragLeave={onDragLeaveTrash} onDrop={onDropTrash}/>
            <div id='palette' onDragOver={onDragOverPalette} onDrop={onDropPalette}>
                <Gear teeth={10} onDragStart={onDragStartPaletteItem}/>
                <Gear teeth={20} onDragStart={onDragStartPaletteItem}/>
                <Gear teeth={30} onDragStart={onDragStartPaletteItem}/>
            </div>
        </div>
    )

}