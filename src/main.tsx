import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import HomePage from './pages/home/home.tsx'
import Menu from './pages/menu.tsx'
import Rooms from './pages/rooms.tsx'
import Login from './pages/login.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import AdminLayout from './pages/admin/AdminHome.tsx'
import { PrivateRoute } from './components/adminComponent/PrivateRoute.tsx'

const router = createBrowserRouter([
  {
    // Root senza path: AuthProvider wrappa tutto il router una volta sola
    element: <AuthProvider><Outlet /></AuthProvider>,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'menu', element: <Menu /> },
          { path: 'menu/:tipo', element: <Menu /> },
          { path: 'rooms', element: <Rooms /> },
        ],
      },
      {
        path: '/admin',
        element: (
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        ),
        children: [
          // { index: true, element: <AdminDashboard /> },
          // { path: 'menu', element: <AdminMenu /> },
          // { path: 'rooms', element: <AdminRooms /> },
          // { path: 'booking', element: <AdminBooking /> },
        ],
      },
      { path: 'login', element: <Login /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
