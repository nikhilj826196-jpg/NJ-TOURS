import React, { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router';

export default function AppRoutes(props) {
  const router = useMemo(() => createRouter(props), [props]);

  return <RouterProvider router={router} />;
}
