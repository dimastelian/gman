;(function() {
    'use strict';

    var appRoot = require('app-root-path');
    var path = require('path');
    var _ = require('lodash');

    class Core {

        constructor()
        {
            this.core_path = 'src/core';
        }

        get require()
        {
            return util.require
        }

        get modules()
        {
            return {
                min: ['src','app','config'],
                all: ['src','routes','controllers','resources','views','config','app']
            }
        }

        core(module)
        {
            return require(path.join(this.core_path,module));
        }

        initApp(name, app_path, modules)
        {
            var self = this;

            if(!modules)
                modules = this.modules.min;

            _.forEach(modules, function(module){

                if(typeof module === 'object')
                {
                    if(module.name && module.path)
                    {
                        self[module.name] = (loadModule) => {
                            return R.require(path.join(app_path, module.path, loadModule || '/'));
                        }
                    }
                }
                else {
                    switch(module)
                    {
                        case 'src':
                            self.src = (loadModule) => {
                                return R.require(path.join(app_path, 'src', loadModule|| '/'));
                            }
                            break;

                        case 'routes':
                            self.routes = (loadModule) => {
                                return R.require(path.join(app_path, 'routes', loadModule || '/'));
                            }
                            break;

                        case 'controllers':
                            self.controllers = (loadModule) => {
                                return R.require(path.join(app_path, 'controllers', loadModule || '/'));
                            }
                            break;

                        case 'resources':
                            self.resources = (loadModule) => {
                                return R.require(path.join(app_path, 'resources', loadModule|| '/'));
                            }
                            break;

                        case 'views':
                            self.views = (loadModule) => {
                                return R.require(path.join(app_path, 'resources/views', loadModule|| '/'));
                            }
                            break;

                        case 'config':
                            self.config = (loadModule) => {
                                return R.require(path.join(app_path, 'config', loadModule|| '/'));
                            }
                            break;

                        case 'app':
                            self.app = (loadModule) => {
                                return R.require(path.join(app_path, loadModule|| '/'));
                            }
                            break;
                    }
                }

            });
        }
    }

    var util = {
        root: appRoot.path,
        require: appRoot.require,

        buildPaths: function()
        {
            console.log(this.root);
        }

    };

    module.exports = {
        Class: Core,
        Util: util,
    };

}());
