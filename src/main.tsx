import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, createBrowserRouter, createRoutesFromChildren, createRoutesFromElements, Route, RouterProvider, Routes } from 'react-router-dom';

import RootLayer from './components/shared/RootLayer';
import { routeConfig } from './configs';
import { AuthProvider } from './context/AuthContext';
import GlobalContextProvider from './context/GlobalContext';
import Login from './pages/LoginPage';
import SignUp from './pages/SignUpPage';
import { QueryProvider } from './react-query/QueryProvider';
import Root from './Root';

const root = createRoot(document.getElementById('root') as HTMLElement);

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />} >
      {/* public routes */}
      <Route index element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* private routes */}
      <Route element={<RootLayer />} >
        {routeConfig.map((route) => (
          <Route
            key={route.label}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
    </Route>
  )
);

root.render(
  <main>
    <RouterProvider router={routes} />
  </main>
  // <BrowserRouter>
  //   <QueryProvider>
  //     <AuthProvider>
  //       <GlobalContextProvider>
  //         <App />
  //       </GlobalContextProvider>
  //     </AuthProvider>
  //   </QueryProvider>
  // </BrowserRouter>
);