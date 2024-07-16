import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { World } from './world'
import { Helmet } from 'react-helmet'

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
            <link rel="icon" href="/images/gear.png"/>
            <link rel="stylesheet" href="/styles/main.css"/>
        </Helmet>
        <RouterProvider router={router}/>
    </>
)