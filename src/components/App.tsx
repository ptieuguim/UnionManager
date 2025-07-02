import logo from '../logo.svg';
import '../App.css';
import './i18n'; // Importer la configuration i18n
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Modifiez <code>src/App.tsx</code> et sauvegardez pour recharger.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apprendre React
        </a>
      </header>
    </div>
  );
};

export default App;
