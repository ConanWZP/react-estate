import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Offers from "./Pages/Offers";
import RestorePassword from "./Pages/RestorePassword";
import Profile from "./Pages/Profile";
import Header from "./Components/Header";

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

        </BrowserRouter>
    );
};

export default App;