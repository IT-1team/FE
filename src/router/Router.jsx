import React from 'react';
import RouterPath from './RouterPath';
import EmployeeRegistration from '../pages/EmployeeRegistration';
import EmployeeSearch from '../pages/EmployeeSearch';
import Attendance from '../pages/Attendance';
import Login from '../pages/Login';
import Layout from '../components/features/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: RouterPath.DASHBOARD,
      element: <Layout />,
      children: [
        {
          path: RouterPath.REGISTRATION,
          element: <EmployeeRegistration />,
        },
        {
          path: RouterPath.SEARCH,
          element: <EmployeeSearch />,
        },
        {
          path: RouterPath.ATTENDANCE,
          element: <Attendance />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Router;
