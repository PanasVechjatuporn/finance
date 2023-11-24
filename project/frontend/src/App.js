//import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
// import Home from './components/home';
import firebase from './services/firebase';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from './pages/dashboard'
import { Home } from './pages/homepage'
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user)
    })
  }, []);

  console.log(user);

  return (
    <div>
      {/* <AppRoutes>
      <div className='header'>
        <Navigate />
      </div>
      <div>
        <CarouselInterval/>
      </div>
      </AppRoutes> */}
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
