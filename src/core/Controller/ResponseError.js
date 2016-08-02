;(function() {
    'use strict';

    const Base = require('./Response');

    class ResponseError extends Base {
        constructor(key, message, code)
        {
            super(code, key, message, null);
        }
    }

    module.exports = ResponseError;

}());
