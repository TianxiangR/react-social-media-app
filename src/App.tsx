import './globals.css';

import React from 'react';
import { Route,Routes } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <main className="flex h-screen w-screen">
      <Routes>

        {/* public routes */}
        <Route index element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* private routes */}
        <Route path='/home' element={<h1>Home</h1>} />
        <Route path='/explore' element={<h1>Explore</h1>} />
        <Route path='/notifications' element={<h1>Notifications</h1>} />
        {/* <Route path='/messages' element={<h1>Messages</h1>} /> */}
        <Route path='/bookmarks' element={<h1>Bookmarks</h1>} />
        <Route path='/profile' element={<h1>Profile</h1>} />

      </Routes>
    </main>
  );
}

export default App;