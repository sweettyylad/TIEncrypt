import React, { useRef } from 'react';
import './Left.scss';

function Left(props) {
  const text = useRef(null);

  return (
    <div className="app-left">
      <h1 className="app-left__text">
        Кодирование&nbsp;
        <br />
        методом&nbsp;
        <br />
        Шеннона-Фано
      </h1>
      <textarea ref={text} className="app-left__textarea" placeholder="..." />
      <div className="app-left__controls">
        <select
          id="variableSelect"
          className="app-left__controls-select"
          onChange={props.onChangeVar}>
          <option value="0">Символы и вероятности</option>
          <option value="1">Символы и их количество</option>
          <option value="2">Строка с текстом</option>
        </select>
        <button
          className="app-left__controls-button"
          onClick={() => {
            props.encode(text.current.value);
          }}>
          Получить результат
        </button>
      </div>
    </div>
  );
}

export default Left;
