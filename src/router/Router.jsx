import React from 'react';
import RouterPath from './RouterPath';
import EmployeeRegistration from '../pages/EmployeeRegistration';
import EmployeeSearch from '../pages/EmployeeSearch';
import Login from '../pages/Login';
import Layout from '../components/features/Layout';
import LandingPage from '../pages/LandingPage';

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
          index: true, // Dashboard의 기본 경로를 LandingPage로 설정
          element: <LandingPage />,
        },
        {
          path: RouterPath.REGISTRATION,
          element: <EmployeeRegistration />,
        },
        {
          path: RouterPath.SEARCH,
          element: <EmployeeSearch />,
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
