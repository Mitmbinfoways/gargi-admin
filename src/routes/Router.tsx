import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from 'src/layouts/full/shared/loadable/Loadable';
import Profile from 'src/views/Profile/page';
import Dashboard from 'src/views/Dashboard/page';
import CreateProduct from 'src/views/CreateProduct/page';
import Product from 'src/views/ProductList/page';
import CreateBlog from 'src/views/CreateBlog/page';
import Blogs from 'src/views/Blogs/page';
import Contact from 'src/views/Contact/page';
import ProtectedRoute from 'src/components/ProtectedRoute/ProtectedRoute';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));


const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/create-product',
        element: (
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: '/products',
        element: (
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        ),
      },
      {
        path: '/create-blog',
        element: (
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        ),
      },
      {
        path: '/blogs',
        element: (
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/contact',
        element: (
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/login', element: <Login /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;
