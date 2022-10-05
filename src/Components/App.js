import { useEffect, useState } from 'react';

import Left from './Left/Left';
import Right from './Right/Right';
import './App.scss';

import fl from './FuncLib';

function App() {
  const [alph, setAlph] = useState([]);

  useEffect(() => {
    fl.centrifyElement('app');
    window.addEventListener('resize', () => {
      fl.centrifyElement('app');
    });
  }, []);

  useEffect(() => {
    console.log(alph);
  }, [alph]);
  return (
    <div className="app" id="app">
      <Left setAlph={setAlph} sendValurToParent={fl.getParams} />
      <Right />
    </div>
  );
}

export default App;
