import _ from 'underscore';
import { slice } from 'underscore/modules/_setup';

function Functions() {
  let self = this;
  this.init = function () {
    self.variables = [
      {
        text: 'Символы и вероятности',
        textForDesc: 'символы и вероятности в виде A:0.12, B:0.43...',
      },
      {
        text: 'Символы и их количество',
        textForDesc: 'символы и их количество в виде A:10, B:5...',
      },
      {
        text: 'Строка с текстом',
        textForDesc: 'строку с текстом',
      },
    ];
  };

  this.viewEncoded = function (arr) {
    function copy(str) {
      var inp = document.createElement('input');
      document.body.appendChild(inp);
      inp.value = str;
      inp.select();
      document.execCommand('copy', false);
      inp.remove();
    }

    const right_content = document.getElementById('right-content');
    let result_string;
    result_string = '';
    result_string += _.map(arr, (e) => {
      return `<div class = "app-right-content__result-item"><div>${e.symbol}</div><div>${e.probability}</div><div>${e.code}</div></div>`;
    }).join('');

    right_content.innerHTML = `
    <div class='app-right-content'>
      <h1 class='app-right-content__caption'>Результат</h1>
      <div class='app-right-content__title'>
      <div class='app-right-content__title-symbol'>Символ</div>
      <div class='app-right-content__title-probability'>Вероятность</div>
      <div class='app-right-content__title-code'>Код</div>
      </div>
      <div class='app-right-content__instruction app-right-content__result'>
      ${result_string}
      </div>
      <div class='app-right-content__controls'>
      <button class="app-right-content__controls-button app-left__controls-button" id = "copy_result">
          Копировать в JSON
        </button>
        <button class="app-right-content__controls-button app-left__controls-button" id = "copy_resulttext">
          Копировать текст
        </button>
</div>
    </div>
    `;

    let JSONstr = JSON.stringify(arr);
    console.log(arr);
    let TXTstr = _.map(
      arr,
      (e) => `${e.symbol}:${e.probability}(${e.code})`,
    ).join(', ');

    document
      .getElementById('copy_result')
      .addEventListener('click', function () {
        copy(JSONstr);
      });

    document
      .getElementById('copy_resulttext')
      .addEventListener('click', function () {
        copy(TXTstr);
      });
  };

  /*
   @description Основная функция для кодирования методом Шеннона-Фано
   @param {string} data строка в заданных интерфейсом условиях
   @return {Array} массив с кодами для каждого символа
   */
  this.encodeData = function (data) {
    let param = data;
    if (param === '') {
      return;
    }
    if (param === 'test') {
      switch (parseInt(document.getElementById('variableSelect').value)) {
        case 0:
          param = 'a:0.12, b:0.13, c:0.25, d:0.5';
          break;
        case 1:
          param = 'a:11, b:15, c:13, d:5';
          break;
        case 2:
          param = 'asidaidoaisdoadiasodiaosdiasodiasodiadoasdxczczczxcxzczczxc';
          break;
      }
    }
    let arr = self.paramsMutator(param);
    arr = arr.sort((a, b) => a.probability - b.probability).reverse();
    arr = arr.map((e) => {
      return {
        symbol: e.symbol,
        probability: e.probability,
        code: '',
      };
    });

    self._encodeData(arr);
    self.encoded = arr;
    self.viewEncoded(self.encoded);
  };

  /*
   @description Функция-дублёр для логики кодирования
   @param {Array} arr массив с символами и вероятностями
   @return {Array} массив с символами, вероятностями и их кодами
  */
  this._encodeData = function (arr) {
    /*
    @description Делит массив на два подмассива
    @param {Array} arr Исходный массив
    @param {int} index Исходный массив
    @return {Array} [arr1, arr2]
    */
    function splitArrIntoTwo(arr, index) {
      let [arr1, arr2] = [
        _.filter(arr, (e, i) => i <= index),
        _.filter(arr, (e, i) => i > index),
      ];
      setCodes([arr1, arr2]);
      return [arr1, arr2];
    }

    /*
    @description Прописывает коды для символов
    @param {Array} arr Массив с двумя подмассивами, каждый из которых соответственно 0 и 1
    @return {Array} Тот же массив, но модифицированный
    */
    function setCodes(arr) {
      _.each(arr[0], (e) => {
        e.code += '1';
      });
      _.each(arr[1], (e) => {
        e.code += '0';
      });
    }

    let sum, min_weight, half_index, weight_iterator;

    sum = _.reduce(arr, (memo, e) => e.probability + memo, 0);
    min_weight = 1;
    half_index = -1;
    weight_iterator = 0;

    _.each(arr, (e, i) => {
      weight_iterator += e.probability;
      if (Math.abs(weight_iterator - (sum - weight_iterator)) < min_weight) {
        min_weight = Math.abs(weight_iterator - (sum - weight_iterator));
        half_index = i;
      }
    });

    arr = splitArrIntoTwo(arr, half_index);

    _.each(arr, (e) => {
      if (_.isArray(e) && e.length > 1) {
        self._encodeData(e);
      }
    });
  };
  this.paramsMutator = function (str) {
    function mutateSymbWithProb(str) {
      return _.map(str.split(','), (e) => {
        return {
          symbol: e.split(':')[0].trim(),
          probability: parseFloat(e.split(':')[1].trim()),
        };
      });
    }

    function mutateSymbWithCount(str) {
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
          probability: parseFloat((e.probability / sum).toFixed(4)),
        };
      });
      return arr;
    }

    function mutateStr(str) {
      let arr = {};
      str = str
        .replaceAll('ё', 'е')
        .replaceAll('ъ', 'ь')
        .replaceAll('\n', '')
        .replaceAll('.', '')
        .replaceAll(',', '')
        .replaceAll(';', '')
        .replaceAll(':', '')
        .replaceAll('-', '')
        .replaceAll('!', '')
        .replaceAll('?', '')
        .replaceAll(' ', '')
        .toLowerCase();

      _.each(str, (e) => {
        if (e === ' ') {
          return;
        }
        arr[e] = _.isUndefined(arr[e]) ? 1 : arr[e] + 1;
      });

      let string = _.map(arr, (e, k) => {
        return `${k}:${e}`;
      }).join(', ');

      return mutateSymbWithCount(string);
    }

    switch (parseInt(document.getElementById('variableSelect').value)) {
      case 0:
        return mutateSymbWithProb(str);
        break;
      case 1:
        return mutateSymbWithCount(str);
        break;
      case 2:
        return mutateStr(str);
        break;
    }
  };
  this.centrifyElement = function (id) {
    let app = document.getElementById(id),
      app_width = app.getBoundingClientRect().width,
      app_height = app.getBoundingClientRect().height,
      body_width = window.innerWidth,
      body_height = window.innerHeight;
    app.style.left = `${(body_width - app_width) / 2}px`;
    app.style.top = `${(body_height - app_height) / 2}px`;
  };
  this.renderSelectVariables = function () {
    document.getElementById('right-content').innerHTML = `
    <div class="app-right-content">
      <h1 class="app-right-content__caption">Порядок работы</h1>
      <ul class="app-right-content__instruction">
        <li class="app-right-content__instruction-item">
          Введите <span id="variableText"></span>
        </li>
        <li class="app-right-content__instruction-item">
          Нажмите на кнопку “Получить результат”
        </li>
        <li class="app-right-content__instruction-item">Наслаждайтесь</li>
      </ul>
    </div>`;
    let currentVariable = document.getElementById('variableSelect').value;
    document.getElementById('variableText').innerText =
      self.variables[currentVariable].textForDesc;
  };
}

const fl = new Functions();
fl.init();
export default fl;
