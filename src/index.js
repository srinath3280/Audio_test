import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegistrationForm from './features/auth/register';
import LoginForm from './features/auth/login';
import SpeechRecognitionBySentence from './features/voicerecord/speechrecognizedbysentence';
import SpeechRecognitionByWord from './features/voicerecord/speechrecognizedbyword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        path: '/register',
        element: <RegistrationForm></RegistrationForm>
      },
      {
        path:'/login',
        element:<LoginForm></LoginForm>
      },
      {
        path:'/speechrecognization',
        element:<SpeechRecognitionBySentence></SpeechRecognitionBySentence>
      },
      {
        path:'/speechrecognizationbyword',
        element:<SpeechRecognitionByWord></SpeechRecognitionByWord>
      }
    ]
  },

])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
