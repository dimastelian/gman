;(function() {
    'use strict';

    const Base = require('./Response');

    class ResponseDefault extends Base {
        constructor(data)
        {
            super(0, 'ok', null, data);
        }
    }

    module.exports = ResponseDefault;

}());
