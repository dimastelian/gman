;(function() {
    'use strict';

    const Core = require('./src/core/Core');
    const path = require('path');

    if(!global.R)
        global.R = new Core.Class();

    global.R.core_path = path.join(__dirname, 'src/core');

    module.exports = {
        Core: Core,
    };

}());
