import {BrowserRouter as Router, createBrowserRouter, Route, Routes, RouterProvider, Navigate} from "react-router-dom";
import EditorPage from "./EditorPage/EditorPage.jsx";
import Landing from './LandingPage/Landing.jsx';
import Dashboard from "./Dashboard/Dashboard.jsx";
import {SignedIn, SignedOut} from "@clerk/clerk-react";
import './index.css'
import Signin from "./Dashboard/Signin.jsx";
import Signup from "./Dashboard/Signup.jsx";

function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Landing/>
        },

        {
            path: "/rooms/:roomId",
            element:
                <>
                    <EditorPage/>
                </>

        },

        {
            path: "/loggedin",
            element:
                <>
                    <SignedIn>
                        <Dashboard></Dashboard>
                    </SignedIn>
                    <SignedOut>
                        <Navigate to="/"/>
                    </SignedOut>
                </>

        },

        {
            path: "/signin",
            element:
                <>
                    <SignedIn>
                       <Navigate to="/loggedin"></Navigate>
                    </SignedIn>

                    <SignedOut>
                        <Signin/>
                    </SignedOut>
                </>
        },

        {
            path: "/signup",
            element:
                <>
                <SignedIn>
                    <Navigate to="/loggedin"></Navigate>
                </SignedIn>

                <SignedOut>
                    <Signup/>
                </SignedOut>
            </>
        }
    ])

    return (
        <>
            <RouterProvider router={router}/>
        </>
    )
}

export default App
