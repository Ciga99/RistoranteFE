import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider, Navigate  } from 'react-router-dom'
import HomePage from './pages/home/home.tsx'
import Menu from './pages/menu.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      // { path: 'about', element: <AboutPage /> },
      { path: 'menu', element: <Menu /> },
      // { path: 'rooms', element: <Rooms /> },
      // { path: 'contact', element: <Contact /> },
    ],
  },
  // {
  //   path: '/admin',
  //   element: <AdminLayout />,  // Sidebar admin + Outlet (protetto con auth)
  //   children: [
  //     { index: true, element: <Login /> },
  //     { index: true, element: <Dashboard /> },
  //     { path: 'menu', element: <GestisciMenu /> },
  //     { path: 'rooms', element: <GestisciRooms /> },
  //   ],
  // },
  { path: '*', element: <Navigate to="/" replace /> }//* inidica qualsici cosa scritta 
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
