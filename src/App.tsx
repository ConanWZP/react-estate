import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Offers from "./Pages/Offers";
import RestorePassword from "./Pages/RestorePassword";
import Profile from "./Pages/Profile";
import Header from "./Components/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/home'} element={<Home/>}/>
                <Route path={'/profile'} element={<Profile/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/offers'} element={<Offers/>}/>
                <Route path={'/restore-password'} element={<RestorePassword/>}/>
            </Routes>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </BrowserRouter>
    );
};

export default App;