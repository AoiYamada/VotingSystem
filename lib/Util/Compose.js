// https://www.codementor.io/michelre/use-function-composition-in-javascript-gkmxos5mj
const Compose = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args);

module.exports = Compose;
