var YASMIJ = require('../index.js');

var input = {
    type: 'maximize',
    objective : 'x1 + 2x2 - x3',
    constraints : [
        '2x1 + x2 + x3 <= 14',
        '4x1 + 2x2 + 3x3 <= 28',
        '2x1 + 5x2 + 5x3 <= 30'
    ]
};

var output = YASMIJ.solve( input );
console.dir(output);
