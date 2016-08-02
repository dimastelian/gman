;(function() {
    'use strict';

    const glob = require('glob');
    const path = require('path');
    const _ = require('lodash');

    const Progress = R.core('widgets/Progress');

    const Controller = R.core('Controller');

    var callHandler = function(handler, hmethod, req, res, next){

        if(!hmethod)
            hmethod = 'main';

        if(_.isArray(handler))
        {
            if(handler.length >= 2)
            {
                return Controller.call(handler[0], handler[1], req, res, next);
            }
            else if(handler.length === 1)
            {
                return Controller.call(handler[0], hmethod, req, res, next);
            }
        }
        else {
            return Controller.call(handler, hmethod, req, res, next);
        }
    };

    module.exports = {
        provider: {get: false, post: false, put: false, patch: false, delete: false},

        request: function(method, route, handler, handlerMethod)
        {
            var m = method.toLowerCase();

            var router = this.provider[m];

            if(!router || typeof router !== 'function')
                throw new Error('METHOD NOT FOUND: Routes.provider.'+m);

            switch(m)
            {
                default:
                case 'get':
                    return this.provider.get(route, function(req, res, next) {
                        return callHandler(handler, handlerMethod, req, res, next);
                    });
                case 'post':
                    return this.provider.post(route, function(req, res, next) {
                        return callHandler(handler, handlerMethod, req, res, next);
                    });
                case 'put':
                    return this.provider.put(route, function(req, res, next) {
                        return callHandler(handler, handlerMethod, req, res, next);
                    });
                case 'options':
                    return this.provider.options(route, function(req, res, next) {
                        return callHandler(handler, handlerMethod, req, res, next);
                    });
                case 'dispatch':
                    return this.provider.dispatch(route, function(req, res, next) {
                        return callHandler(handler, handlerMethod, req, res, next);
                    });
                case 'delete':
                    return this.provider.delete(route, function(req, res, next) {
                        return callHandler(handler, handlerMethod, req, res, next);
                    });
                case 'all':
                    return this.provider.all(route, function(req, res, next) {
                        return callHandler(handler, handlerMethod, req, res, next);
                    });
                case 'any':
                    return this.provider.any(route, function(req, res, next) {
                        return callHandler(handler, handlerMethod, req, res, next);
                    });
            }
        },

        get: function(route, handler, handlerMethod) {
            return this.request('GET', route, handler, handlerMethod);
        },

        post: function(route, handler, handlerMethod) {
            return this.request('POST', route, handler, handlerMethod);
        },

        put: function(route, handler, handlerMethod) {
            return this.request('PUT', route, handler, handlerMethod);
        },

        options: function(route, handler, handlerMethod) {
            return this.request('OPTIONS', route, handler, handlerMethod);
        },

        dispatch: function(route, handler, handlerMethod) {
            return this.request('DISPATCH', route, handler, handlerMethod);
        },

        delete: function(route, handler, handlerMethod) {
            return this.request('DELETE', route, handler, handlerMethod);
        },

        autoload: function(dirname, cb) {

            glob(dirname+'/*.routes.js', function(er, clist){

                var pbar = Progress.bar('Autoloading :current/:total Routes...', clist.length);

                _.forEach(clist, function(cfile){
                    var parsed = path.parse(cfile);

                    var module = require(cfile);

                    if(typeof module === 'object')
                    {
                        if(module.init)
                            module.init();
                        if(module.setup)
                            module.setup();
                        if(module.main)
                            module.main();
                    }

                    if(typeof cb === 'function')
                        cb(module, parsed, cfile);

                    if(pbar)
                        pbar.tick();
                });
            });
        }
    }

}());
