import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Verify from "./views/Verify";
import Login from "./views/Login";

interface AppProps {}

const App = (props: AppProps) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="mx-auto mt-5 w-25">
                            <div className="alert alert-info text-center">Hello </div>
                        </div>
                    }
                />
                <Route path="/verify" element={<Verify />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
