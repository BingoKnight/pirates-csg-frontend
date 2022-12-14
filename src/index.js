import './index.css';  // At the top because it messes with style

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import CsgModal from './components/modal/CsgModal.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import AccountSettings from './pages/AccountSettings.tsx';
import ForgotUsername from './pages/ForgotUsername.tsx';
import Home from './pages/Home';
import Login from './pages/Login.tsx';
import Registration from './pages/Registration.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path='/' element={<Home />}>
                    <Route path='details/:id' element={<CsgModal />} />
                </Route>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Registration />} />
                <Route path='/user' element={<PrivateRoute />}>
                    <Route path='account-settings' element={<AccountSettings />} />
                </Route>
                {/* <Route path='/forgot-username' element={<ForgotUsername />} /> */}
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Router>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

