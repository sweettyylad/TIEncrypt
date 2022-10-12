import _ from 'underscore';

class Encryptor {
  constructor(el) {
    this.variables = [
      {
        text: 'Символы и вероятности',
        text_desc: 'символы и вероятности в виде A:0.12, B:0.43...',
      },
      {
        text: 'Символы и их количество',
        text_desc: 'символы и их количество в виде A:10, B:5...',
      },
      {
        text: 'Строка с текстом',
        text_desc: 'строку с текстом',
      },
    ];
    this.el = el;
  }

  /** Workers */

  /**
   * @description Copy string to Buffer
   * @param {String} str Your string
   */
  copyStringToBuffer(str) {
    var inp = document.createElement('input');
    document.body.appendChild(inp);
    inp.value = str;
    inp.select();
    document.execCommand('copy', false);
    inp.remove();
  }

  /**
   * @description Link centrify method to window resize event
   */
  linkResizeEvent() {
    this.centrifyElementInWindow(this.el);
    window.addEventListener('resize', () => {
      this.centrifyElementInWindow(this.el);
    });
  }

  /**
   * @description Get type of work
   * @return {Int} Your variable
   */
  getSelectValue() {
    return parseInt(document.getElementById('variableSelect').value);
  }

  init() {
    this.right = document.getElementById('right-content');
    this.select = document.getElementById('variableSelect');
    this.linkResizeEvent();
    this.renderSelectVariables();
  }

  /** Mutate */

  /**
   * @description Подсчитывает количество символов в строке
   * @param {String} str Строка из символов (любой текст)
   * @return {String} Строку в виде a:15, v:20, c:25...,
   * где до двоеточия символ, после - количество его вхождений
   */
  calcCharsInString(str) {
    let arr = {};
    _.each(str, (e) => {
      if (e === ' ') {
        return;
      }
      arr[e] = _.isUndefined(arr[e]) ? 1 : arr[e] + 1;
    });
    return _.map(arr, (e, k) => {
      return `${k}:${e}`;
    }).join(', ');
  }

  /**
   * @description Приводит любую строку к массиву из символов и вероятностей
   * @param {String} str Строка в указанном в интерфейсе виде
   * @return {Array} Массив из объектов с символами и их вероятностями
   */
  allStringToArray(str) {
    switch (this.getSelectValue()) {
      case 0:
        return this.SAPToArray(str);
        break;
      case 1:
        return this.SACToArray(str);
        break;
      case 2:
        return this.SToArray(str);
        break;
    }
  }

  /**
   * @description Удаляет ненужные символы из строки, преобразует всё в нижний регистр, меняет [ё, ъ] на [е, ь]
   * @param {String} str Исходная строка
   * @return {String} Преобразованная строка
   */
  excludeBadChars(str) {
    return str
      .toLowerCase()
      .replaceAll('\n', '')
      .replaceAll(' ', '')
      .replace(/[.,:;!?-]/gm, '')
      .replace(/[ъ]/g, 'ь')
      .replace(/[ё]/g, 'е');
  }

  /**
   * @description Преобразует строку в массив с символами и вероятностями
   * @param {String} str Строка вида <символ>:<количество>
   * @return {Array} Массив с символами и вероятностями
   */
  SACToArray(str) {
    let arr = _.map(str.split(','), (e) => {
      return {
        symbol: e.split(':')[0].trim(),
        probability: parseFloat(e.split(':')[1].trim()),
      };
    });

    let sum = _.reduce(
      arr,
      (memo, e) => {
        return memo + e.probability;
      },
      0,
    );

    arr = _.map(arr, (e) => {
      return {
        symbol: e.symbol,
        probability: parseFloat((e.probability / sum).toFixed(3)),
      };
    });
    return arr;
  }

  /**
   * @description Преобразует строку в массив с символами и вероятностями
   * @param {String} str Строка вида <символ>:<вероятность>
   * @return {Array} Массив с символами и вероятностями
   */
  SAPToArray(str) {
    return _.map(str.split(','), (e) => {
      return {
        symbol: e.split(':')[0].trim(),
        probability: parseFloat(e.split(':')[1].trim()),
      };
    });
  }

  /**
   * @description Преобразует строку в массив с символами и вероятностями
   * @param {String} str Строка с текстом
   * @return {Array} Массив с символами и вероятностями
   */
  SToArray(str) {
    let string = this.calcCharsInString(this.excludeBadChars(str));

    return this.SACToArray(string);
  }

  /** Encode */

  /**
   * @description Делит исходный массив на два массива длиной [{0 - index, index+1 - arr.length}]
   * @param {Array} arr Исходный массив
   * @param {Int} index Правая граница для первого подмассива
   * @return {Array} Массив из двух подмассивов
   */
  splitArrIntoTwo(arr, index) {
    let [arr1, arr2] = [
      _.filter(arr, (e, i) => i <= index),
      _.filter(arr, (e, i) => i > index),
    ];
    this.setCodes([arr1, arr2]);
    return [arr1, arr2];
  }

  /**
   * @description Считает, на каком элементе должен заканчиваться первый подмассив
   * @param {Array} a Исходный массив
   * @param {Int} l Длина массива
   * @return {Int} Индекс нужного элемента
   */
  calcMiddleIndex(a, l) {
    let cont = true;
    let w = 0,
      mw = 1,
      s = _.reduce(a, (memo, e) => e.probability + memo, 0);
    var half = -1;
    _.each(a, (e, i) => {
      if (cont) {
        w += e.probability;
        if (Math.abs(w - (s - w)) < mw) {
          mw = Math.abs(w - (s - w));
          half = i;
          if (i >= Math.floor(l / 2) - 1) {
            cont = false;
          }
        }
      }
    });
    return half;
  }

  /**
   * @description Возвращает результат функции calcMiddleIndex
   * @param {Array} arr Исходный массив
   * @return {Int} Индекс нужного элемента
   */
  getMiddleIndex(arr) {
    let length = arr.length;
    return this.calcMiddleIndex(arr, length);
  }

  /**
   * @description Функция двойник для алгоритма кодирования
   * @param {Array} arr Исходный массив
   */
  _encodeData(arr) {
    let half_index = this.getMiddleIndex(arr);
    arr = this.splitArrIntoTwo(arr, half_index);
    _.each(arr, (e) => {
      if (_.isArray(e) && e.length > 1) {
        this._encodeData(e);
      }
    });
  }

  /**
   * @description Основная функция кодирования
   * @param {String} data Строка, введенная пользователем
   */
  encodeData(data) {
    let param = data.trim();

    if (param === '') {
      return;
    }

    let arr = this.allStringToArray(param);
    arr = arr.sort((a, b) => a.probability - b.probability).reverse();
    arr = arr.map((e) => {
      return {
        symbol: e.symbol,
        probability: e.probability,
        code: '',
      };
    });

    this._encodeData(arr);
    this.encoded = arr;
    this.showEncoded(this.encoded);
  }

  /**
   * @description Добавляет соответствующие коды к элементам
   * @param {Array} arr Массив с двумя подмассивами, каждый из которых соотв. старшая и младшая подгруппы
   */
  setCodes(arr) {
    _.each(arr[0], (e) => {
      e.code += '1';
    });
    _.each(arr[1], (e) => {
      e.code += '0';
    });
  }

  /** Render */

  /**
   * @description Центрирует элемент по размерам страницы
   * @param {String} id ID элемента, который нужно отцентрировать
   */
  centrifyElementInWindow(id) {
    let app = document.getElementById(id),
      app_width = app.getBoundingClientRect().width,
      app_height = app.getBoundingClientRect().height,
      body_width = window.innerWidth,
      body_height = window.innerHeight;
    app.style.left = `${(body_width - app_width) / 2}px`;
    app.style.top = `${(body_height - app_height) / 2}px`;
  }

  /**
   * @description Рендерит текст для инструкции в соотв. с текущим вариантом алгоритма
   */
  renderSelectVariables() {
    this.setVariabeTemplate(
      this.getTemplateByVariable(this.variables[this.select.value].text_desc),
    );
  }

  /**
   * @description Отдаёт литерал с полным шаблоном для инструкции
   * @param {String} variable Изменяемая в инструкции строка
   * @return {String} Шаблон для рендера
   */
  getTemplateByVariable(variable) {
    return `<div class='app-right-content'>
      <h1 class='app-right-content__caption'>Порядок работы</h1>
      <ul class='app-right-content__instruction'>
        <li class='app-right-content__instruction-item'>
          Введите <span id='variableText'>${variable}</span>
        </li>
        <li class='app-right-content__instruction-item'>
          Нажмите на кнопку “Получить результат”
        </li>
        <li class='app-right-content__instruction-item'>Наслаждайтесь</li>
      </ul>
    </div>`;
  }

  /**
   * @description Рендерит шаблон в инструкцию
   * @param {String} template Шаблон
   */
  setVariabeTemplate(template) {
    this.right.innerHTML = template;
  }

  /**
   * @description Отдаёт шаблон с результатами кодирования
   * @param {Array} arr Массив с символами, вероятностями и их кодами
   * @return {String} Шаблон
   */
  getResultTemplate(arr) {
    return _.map(arr, (e) => {
      return `<div class = 'app-right-content__result-item'><div>${e.symbol}</div><div>${e.probability}</div><div>${e.code}</div></div>`;
    }).join('');
  }

  /**
   * @description Рендерит шаблон с результатами
   * @param {String} str Таблица с результатами кодирования
   */
  setResultTemplate(str) {
    this.right.innerHTML = `
    <div class='app-right-content'>
      <h1 class='app-right-content__caption'>Результат</h1>
      <div class='app-right-content__title'>
        <div class='app-right-content__title-symbol'>Символ</div>
        <div class='app-right-content__title-probability'>Вероятность</div>
        <div class='app-right-content__title-code'>Код</div>
      </div>
      <div class='app-right-content__instruction app-right-content__result'>
        ${str}
      </div>
      <div class='app-right-content__controls'>
        <button class='app-right-content__controls-button app-left__controls-button' id = 'copy_result'>
          Копировать в JSON
        </button>
        <button class='app-right-content__controls-button app-left__controls-button' id = 'copy_resulttext'>
          Копировать текст
        </button>
      </div>
    </div>
    `;
  }

  /**
   * @description Рендерит всю правую часть с результатами и кнопками для копирования результата
   * @param {Array} arr Массив с символами, вероятностями и кодами
   */
  showEncoded(arr) {
    let result_string = this.getResultTemplate(arr);
    this.setResultTemplate(result_string);

    let JSONstr = JSON.stringify(arr);
    let TXTstr = _.map(
      arr,
      (e) => `${e.symbol}:${e.probability}(${e.code})`,
    ).join(', ');

    document.getElementById('copy_result').addEventListener('click', () => {
      this.copyStringToBuffer(JSONstr);
    });

    document.getElementById('copy_resulttext').addEventListener('click', () => {
      this.copyStringToBuffer(TXTstr);
    });
  }
}

export default Encryptor;
