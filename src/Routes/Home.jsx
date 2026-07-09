import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Main from '../Pages/Home/Main'


const Home = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Main />} />
            </Routes>
        </>
    )
}

export default Home