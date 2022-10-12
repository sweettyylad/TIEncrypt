import React, { useEffect, useRef } from 'react';
import './Left.scss';

function Left(props) {
  const text = useRef(null);

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
      />
      <div className="app-left__controls">
        <button
          className="app-left__controls-button"
          onClick={() => {
            props.encode(text.current.value);
          }}>
          Получить результат
        </button>
        <select
          id="variableSelect"
          className="app-left__controls-select"
          onChange={props.onChangeVar}>
          <option value="0">Символы и вероятности</option>
          <option value="1">Символы и их количество</option>
          <option value="2">Строка с текстом</option>
        </select>
      </div>
    </div>
  );
}

export default Left;
