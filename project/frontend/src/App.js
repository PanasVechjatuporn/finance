import logo from './logo.svg';
import './App.css';
function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}


import { useEffect } from 'react';
import '..backend/routes/testApi.js'
function testAPI() {
  const [serverUrl, setServerUrl] = useState('http://localhost:8888/testAPI');
  useEffect(() => {
  })
  return (
    <div>
    </div>
  )
}

export default App;
