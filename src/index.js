import './index.css';  // At the top because it messes with style

import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage.tsx';

import reportWebVitals from './reportWebVitals';
import MobileModal from './components/modal/MobileModal.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
const routes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/details/:id',
        element: <MobileModal />
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
]

const router = createBrowserRouter(routes.map(route => ({path: route.path, element: route.element})))

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

