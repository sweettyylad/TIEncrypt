import React, { useEffect, useRef } from 'react';
import './Left.scss';

function Left(props) {
  const text = useRef(null);

  useEffect(() => {
    props.fl.renderSelectVariables();
  }, []);

  return (
    <div className="app-left">
      <h1 className="app-left__text">
        Кодирование
        <br />
        методом
        <br />
        Шеннона-Фано
      </h1>
      <textarea
        ref={text}
        className="app-left__textarea"
        placeholder="a:0.01, b:0.02, c:0.03..."
        value="test"></textarea>
      <div className="app-left__controls">
        <button
          onClick={() => {
            props.sendValueToParent(text.current.value);
          }}
          className="app-left__controls-button">
          Получить результат
        </button>
        <select
          className="app-left__controls-select"
          id="variableSelect"
          onChange={props.fl.renderSelectVariables}>
          <option value="0">Символы и вероятности</option>
          <option value="1">Символы и их количество</option>
          <option value="2">Строка с текстом</option>
        </select>
      </div>
    </div>
  );
}

export default Left;
