import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { World } from './world'

import * as GearIcon from '../images/gear.png'

import '../styles/main.css'

// Router

const router = createBrowserRouter([
    { path: '/', element: <World/> }
])

// Container

const container = document.createElement('div')
container.id = 'root'

// Body

document.body.appendChild(container)

// Root

const root = createRoot(container)
root.render(
    <>
        <Helmet>
            <title>Gear Expert</title>
            <link rel="icon" href={GearIcon}/>
        </Helmet>
        <RouterProvider router={router}/>
    </>
)