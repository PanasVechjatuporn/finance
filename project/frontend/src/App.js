//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Route, Routes } from 'react-router-dom';
import Navigate from './components/Navbar';
import IndividualIntervalsExample from './components/Carousel';
import { useState, useEffect } from 'react';
// import Home from './components/home';
import firebase from './services/firebase';

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
