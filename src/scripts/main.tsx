import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Index } from './components/Index'

// Router

const router = createBrowserRouter([
    { path: '/', element: <Index/> }
])

// Container

const container = document.createElement('div')
container.className = 'root'
container.style.width = '100vw'
container.style.height = '100vh'

// Body

document.body.appendChild(container)
document.body.style.margin = '0'

// Root

const root = createRoot(container)

root.render(<RouterProvider router={router}/>)