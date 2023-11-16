//import logo from './logo.svg';
import './App.css';
import Navigate from './components/Navbar';
import IndividualIntervalsExample from './components/Carousel';
import { useState, useEffect } from 'react';
// import Home from './components/home';
import firebase from './services/firebase';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './Routes';
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
      <AppRoutes></AppRoutes>
      <div className='header'>
        <Navigate />
      </div>
      <div>
        <IndividualIntervalsExample/>
      </div>
    </div>
  );
}

export default App;
