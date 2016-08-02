;(function() {
    'use strict';

    var appRoot = require('app-root-path');
    var path = require('path');
    var _ = require('lodash');

    class Core {

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
            return this.require('src/core/'+module);
        }

        initCustomApp(name, app_path, modules)
        {
            var self = this;

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
                                return R.require(path.join(app_path, 'src/controllers', loadModule || '/'));
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

        initApp(name, app_path)
        {
            this.initCustomApp(name, app_path, this.modules.all)
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
