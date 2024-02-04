import './globals.css';

import React from 'react';
import { Route,Routes } from 'react-router-dom';

import AuthLayout from './_auth/AuthLayout';
import SignInForm from './_auth/forms/SignInForm';
import SignUpForm from './_auth/forms/SignUpForm';
import { 
  AllUsers, 
  CreatePost, 
  EditPost, 
  Explore, 
  Home, 
  PostDetails, 
  Profile, 
  Saved, 
  UpdateProfile 
} from './_root/pages';
import RootLayout from './_root/RootLayout';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <main className="flex h-screen">
      <Routes>

        {/* public routes */}
        <Route element={<AuthLayout/>}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout/>}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore/>} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers/>} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<EditPost />} />
          <Route path="/posts/:postId" element={<PostDetails />} />
          <Route path="/profile/:userId/*" element={<Profile />} />
          <Route path="/update-profile/:userId" element={<UpdateProfile />} />
        </Route>x
      </Routes>
      <Toaster />
    </main>
  );
}

export default App;