import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Offers from "./Pages/Offers";
import RestorePassword from "./Pages/RestorePassword";
import Profile from "./Pages/Profile";
import Header from "./Components/Header";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./Components/PrivateRoute";
import {authStateCheck} from "./store/reducers/authSlice";
import {useAppDispatch, useAppSelector} from "./hooks/reduxHooks";
import Loader from "./Components/Loader";
import CreateAdvertisement from "./Pages/CreateAdvertisement";
import EditAdvertisement from "./Pages/EditAdvertisement";
import AdvertisementPage from "./Pages/AdvertisementPage";
import CategoryPage from './Pages/CategoryPage';

const App = () => {

    const {loading} = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(authStateCheck())
    }, [])

    if (loading) {
        return <Loader/>
    }

    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/home'} element={<Home/>}/>
                <Route path={'/profile'} element={<PrivateRoute/>}>
                    <Route path={''} element={<Profile/>}/>
                </Route>
                <Route path={'/create-advertisement'} element={<PrivateRoute/>}>
                    <Route path={''} element={<CreateAdvertisement/>}/>
                </Route>
                <Route path={'/edit-advertisement/'} element={<PrivateRoute/>}>
                    <Route path={':id'} element={<EditAdvertisement/>}/>
                </Route>
                <Route path={'/category/:categoryType/:id'} element={<AdvertisementPage/>}/>
                <Route path={'/category/:categoryType'} element={<CategoryPage/>}/>
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