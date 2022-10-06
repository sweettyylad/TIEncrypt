import _ from 'underscore';
import { slice } from 'underscore/modules/_setup';

const fl = {
  centrifyElement: function (id) {
    let app = document.getElementById(id),
      app_width = app.getBoundingClientRect().width,
      app_height = app.getBoundingClientRect().height,
      body_width = window.innerWidth,
      body_height = window.innerHeight;
    app.style.left = `${(body_width - app_width) / 2}px`;
    app.style.top = `${(body_height - app_height) / 2}px`;
  },
  getParams: function (param, setAlph) {
    function paramsMutator(str) {
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
    }
    function sumOfProbs(arr) {
      return _.reduce(arr, (memo, e) => e.probability + memo, 0);
    }
    function sliceArrByProbs(arr) {
      let newArr = [...arr];
      let mid = 0,
        sum = 0,
        min = 1,
        minIndex;
      _.each(newArr, (e, k) => {
        sum += e.probability;
        if (Math.abs(sum - (1 - sum)) < min) {
          min = Math.abs(sum - (1 - sum));
          minIndex = k;
        }
        console.log(k, sum - (1 - sum));
      });
      console.log(arr);
      console.log(min, minIndex);
    }
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
          param = 'hello my dear friend';
          break;
      }
    }
    let arr = paramsMutator(param);
    arr = arr.sort((a, b) => a.probability - b.probability).reverse();
    sliceArrByProbs(arr);
    setAlph(arr);
  },
  changeVariable: function (e) {
    let currentVariable = e.target.value;
    const variables = [
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
    document.getElementById('variableText').innerText =
      variables[currentVariable].textForDesc;
  },
  renderSelectVariables: function () {
    let currentVariable = document.getElementById('variableSelect').value;
    const variables = [
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
    document.getElementById('variableText').innerText =
      variables[currentVariable].textForDesc;
  },
};

export default fl;
