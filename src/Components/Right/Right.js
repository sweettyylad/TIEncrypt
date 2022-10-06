import React, { useEffect, useState } from 'react';
import _ from 'underscore';

import './Right.scss';
const InitialContent = () => {
  return (
    <div className="app-right-content">
      <h1 className="app-right-content__caption">Порядок работы</h1>
      <ul className="app-right-content__instruction">
        <li className="app-right-content__instruction-item">
          Введите <span id="variableText"></span>
        </li>
        <li className="app-right-content__instruction-item">
          Нажмите на кнопку “Получить результат”
        </li>
        <li className="app-right-content__instruction-item">Наслаждайтесь</li>
      </ul>
    </div>
  );
};
function Right(props) {
  return (
    <div className="app-right" id="right-content">
      <InitialContent />
    </div>
  );
}

export default Right;
