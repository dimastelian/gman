;(function() {
    'use strict';

    const Progress = R.core('widgets/Progress');
    const glob = require('glob');
    const _ = require('lodash');
    const path = require('path');
    const Promise = require('bluebird');

    module.exports =  function(dirname, options) {

        var defaults = {
            run: true,          // should attempt to initialize/run loaded modules?
            namespace: {},      // where loaded modules are stored
            pattern: "*.*",     // glob pattern, by default loads all files
            progress: true,     // show progress bar?
            progress_text: "Loading :current/:total Files..."
        }

        if(!options)
            options = {};

        var o = _.assign({}, defaults, options);

        return new Promise(function(resolve){

            o.namespace = {};

            glob(path.join(dirname, o.pattern), function(er, clist){

                var pbar;

                if(o.progress)
                {
                    pbar = Progress.bar(o.progress_text, clist.length);
                }

                var _all = [];

                _.forEach(clist, function(cfile){
                    var parsed = path.parse(cfile);
                    var module = false;

                    try {
                      module = require(cfile);
                    } catch (err) {

                    }

                    _all.push(new Promise(function(resolve){

                        o.namespace[parsed.name] = module;

                        if(typeof module === 'object')
                        {
                            if(typeof module.init === 'function')
                                module.init();

                            if(typeof module.setup === 'function')
                                module.setup();

                            if(typeof module.onStart === 'function')
                                module.onStart();

                            if(typeof module.main === 'function')
                                module.main();
                        }

                        if(pbar)
                            pbar.tick();

                        resolve(module);

                    }));
                });

                Promise.all(_all)
                .then(function(){
                    resolve(o.namespace);
                })

            });

        });
    }
}());
