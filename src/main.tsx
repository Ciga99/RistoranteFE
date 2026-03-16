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
import AdminMenuPage from './pages/admin/AdminMenuPage.tsx'
import AdminDishPage from './pages/admin/AdminDishPage.tsx'
import AdminRoomsPage from './pages/admin/AdminRoomsPage.tsx'
import AdminCalendarPage from './pages/admin/AdminCalendarPage.tsx'
import AdminMenuDetailPage from './pages/admin/AdminMenuDetailPage.tsx'

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
          { path: 'menu-admin', element: <AdminMenuPage /> },
          { path: 'menu-admin/:id', element: <AdminMenuDetailPage /> },
          { path: 'dish-admin', element: <AdminDishPage /> },
          { path: 'rooms-admin', element: <AdminRoomsPage /> },
          { path: 'calendar-admin', element: <AdminCalendarPage /> },
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
