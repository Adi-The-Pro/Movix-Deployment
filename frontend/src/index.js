import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import ContextProviders from './context';

//Importing the 'index.css' which can be accesed anywhere
import './index.css';
//Impoting the main app file
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <BrowserRouter>
    <ContextProviders>  {/*We have put all the context providers in one file instead of writing here one by one*/}
      <App/>
    </ContextProviders>
  </BrowserRouter>
);