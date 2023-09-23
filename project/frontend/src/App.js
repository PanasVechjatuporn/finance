//import logo from './logo.svg';
import './App.css';
import Navigate from './components/Navbar';
import IndividualIntervalsExample from './components/Carousel';
function App() {
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
