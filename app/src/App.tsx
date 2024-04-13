import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './output.css';
import {Route, Routes, Navigate} from 'react-router-dom';
import Home from "./Pages/home/Home";
import ApplicationLayout from "./layout/applicationLayout";
import Join from "./Pages/home/join";
import AuthLayout from "./layout/AuthLayout";
import Login from "./Pages/auth/login";
import {SuperTokensWrapper} from "supertokens-auth-react";
import {SessionAuth} from 'supertokens-auth-react/recipe/session';
import {initSuperTokens} from "./lib/auth/supertokens";
import Register from "./Pages/auth/register";

initSuperTokens();

function App() {

    const [subdomain, setSubDomain] = useState("null");
    const [communityFound, setCommunity] = useState("null");

    useEffect(() => {
        const host = window.location.host; // gets the full domain of the app

        const arr = host
            .split(".")
            .slice(0, host.includes("local") ? -1 : -2);
        if (arr.length > 0) {
            setSubDomain(arr[0]);
            console.log(arr[0])
        }
    }, []);


  return (
      <SuperTokensWrapper>

        <Routes>
            <Route path="/login" element={<AuthLayout>
<Login/>
                </AuthLayout>}/>
            <Route path="/register" element={<AuthLayout>
                <Register/>
            </AuthLayout>}/>

            <Route path="/" element={ <SessionAuth><ApplicationLayout host={subdomain}>

                <Join/>
                <Home host={subdomain}/></ApplicationLayout> </SessionAuth>}/>
            <Route path='/auth' element={<AuthLayout>
                <Login/>
            </AuthLayout>}/>
        </Routes>
      </SuperTokensWrapper>

    );
}

export default App;
