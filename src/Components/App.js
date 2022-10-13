import { useEffect, useState } from 'react';

import Left from './Left/Left';
import Right from './Right/Right';
import './App.scss';

import Encryptor from './Encryptor';

function App() {
  let encryptor = new Encryptor('app');
  useEffect(() => {
    encryptor.init();
  }, []);

  const onChangeVariable = () => {
    encryptor.renderSelectVariables();
  };
  const onEncodeClick = (str) => {
    encryptor.encodeData(str);
  };

  return (
    <div className="app" id="app">
      <Left
        enc={encryptor}
        onChangeVar={onChangeVariable}
        encode={onEncodeClick}
      />
      <Right enc={encryptor} />
    </div>
  );
}

export default App;
