import * as React from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTFLoader()

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

    const [scene] = React.useState(new THREE.Scene())
    const [camera] = React.useState(new THREE.PerspectiveCamera())
    const [renderer] = React.useState(new THREE.WebGLRenderer())
    const [raycaster] = React.useState(new THREE.Raycaster())

    // Effects

    React.useEffect(() => {
        const grid = new THREE.GridHelper(1, 100)

        const ambient = new THREE.AmbientLight('white', 0.5)

        const point = new THREE.PointLight('white', 0.5)
        point.position.x = 0.3
        point.position.y = 0.3
        point.position.z = 0.3

        scene.background = new THREE.Color('white')
        scene.add(grid)
        scene.add(ambient)
        scene.add(point)

        addGear(10, 'shaft', x1, 0, 0, angle1, speed1)
        addGear(20, 'shaft', x2, 0, 0, angle2, speed2)
        addGear(30, 'shaft', x3, 0, 0, angle3, speed3)

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

    function addGear(teeth: number, style: 'plain' | 'shaft', x: number, y: number, z: number, angle: number, speed: number) {
        const gear = new THREE.Group()
        gear.position.x = x
        gear.position.y = y
        gear.position.z = z
        gear.rotation.y = angle
        gear.userData = { teeth, style, x, y, z, angle, speed }

        loader.loadAsync(`models/${style}/gear${teeth}.gltf`).then(model => {
            const r = Math.random()
            const g = Math.random()
            const b = Math.random()

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

            gear.add(model.scene)
        })

        scene.add(gear)

        onFrame()
    }

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

    function onClick(event: React.MouseEvent<HTMLDivElement>) {
        const x = +((event.pageX - ref.current.offsetLeft)  / ref.current.offsetWidth) * 2 - 1
        const y = -((event.pageY - ref.current.offsetTop) / ref.current.offsetHeight) * 2 + 1

        const mouse = new THREE.Vector2(x, y)

        raycaster.setFromCamera(mouse, camera)

        const origin = raycaster.ray.origin
        const direction = raycaster.ray.direction
        const distance = -origin.y / direction.y
        const position = origin.add(direction.multiplyScalar(distance))

        addGear(Math.floor(Math.random() * 3) * 10 + 10, 'shaft', round(position.x), round(position.y), round(position.z), 0, 0.01)
    }

    // Return
    
    return <div ref={ref} style={{width: '100%', height: '100%'}} onClick={onClick}/>

}

function round(value: number) {
    return Math.round(value * 100) / 100
}