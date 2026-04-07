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
import AdminMenuFormPage from './pages/admin/AdminMenuFormPage.tsx'
import AdminMenuDishFormPage from './pages/admin/AdminMenuDishFormPage.tsx'
import AdminDishPage from './pages/admin/AdminDishPage.tsx'
import AdminDishFormPage from './pages/admin/AdminDishFormPage.tsx'
import AdminRoomsPage from './pages/admin/AdminRoomsPage.tsx'
import AdminRoomsFormPage from './pages/admin/AdminRoomsFormPage.tsx'
import AdminMenuDetailPage from './pages/admin/AdminMenuDetailPage.tsx'
import RoomDetail from './pages/RoomDetail.tsx'

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
          { path: 'rooms/:id', element: <RoomDetail /> },
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
          // Menu
          { path: 'menu-admin', element: <AdminMenuPage /> },
          { path: 'menu-admin/new', element: <AdminMenuFormPage /> },
          { path: 'menu-admin/:id/edit', element: <AdminMenuFormPage /> },
          { path: 'menu-admin/:menuId/add-dish', element: <AdminMenuDishFormPage /> },
          { path: 'menu-admin/:id', element: <AdminMenuDetailPage /> },
          // Piatti
          { path: 'dish-admin', element: <AdminDishPage/> },
          { path: 'dish-admin/new', element: <AdminDishFormPage/> },
          { path: 'dish-admin/:id/edit', element: <AdminDishFormPage/> },
          // Stanze
          { path: 'rooms-admin', element: <AdminRoomsPage /> },
          { path: 'rooms-admin/new', element: <AdminRoomsFormPage /> },
          { path: 'rooms-admin/:id/edit', element: <AdminRoomsFormPage /> },
          // // Calendario / Prenotazioni
          // { path: 'calendar-admin', element: <AdminCalendarPage /> },
          // { path: 'calendar-admin/new', element: <AdminBookingFormPage /> },
          // { path: 'calendar-admin/:id/edit', element: <AdminBookingFormPage /> },
          { path: '*', element: <Navigate to="/menu-admin" replace /> },
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
