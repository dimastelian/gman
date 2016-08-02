'use strict';

const glob = require('glob');
const path = require('path');
const _ = require('lodash');

const Progress = R.core('widgets/Progress');

var ResponseError = require('./Controller/ResponseError');
var ResponseDefault = require('./Controller/ResponseDefault');
// var ResponseMessage = require('./Controller/ResponseMessage');
var reqErrHandler = require('./Controller/RequestErrorHandler');

var Output = function(res, responseMessage)
{
    if(!responseMessage.constructor)
        responseMessage = new ResponseDefault(responseMessage);

    if(res.status)
        res.status(responseMessage.statusCode());

    if(res.send)
        return res.send(responseMessage.getJson());
    else if(res.end)
        return res.end(responseMessage.getJson());
    else if(typeof res === "function")
        return res(responseMessage.getJson());

}

var repo = {};

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

var Registry = {

    autoload: function(ns, dirname, cb)
    {

        glob(dirname+'/*Controller.js', function(er, clist){

            var pbar = Progress.bar('Autoloading :current/:total Controllers...', clist.length);

            _.forEach(clist, function(cfile){
                var parsed = path.parse(cfile);

                var module = require(cfile);

                Registry.register(parsed.name, module);
                Registry.set(parsed.name, ns);

                if(typeof cb === 'function')
                    cb(module, parsed, cfile);

                if(pbar)
                    pbar.tick();
            });
        });

    },

    register: function(name, ControllerClass, req, res, next) {
        repo[name] = ControllerClass;
    },
    set: function(name, namespace)
    {
        if(typeof namespace === 'object')
        {
            namespace[name] = repo[name];
        }
        if(exportObject)
        {
            if(namespace)
            {
                if(!exportObject[namespace])
                    exportObject[namespace] = {};

                exportObject[namespace][name] = repo[name];
            }
            else {
                exportObject[name] = repo[name];
            }
        }
    },
    list: function()
    {
        return repo;
    },
    call: function(ControllerDef, method, req, res, next)
    {
        var instance = {};

        if(typeof ControllerDef === 'function')
        {
            if(!method)
                return ControllerDef(req,res,next);

            instance = new ControllerDef(req, res, next);
        }
        else if(typeof ControllerDef === 'object' && ControllerDef.constructor.name === 'Function')
        {
            instance = new ControllerDef(req, res, next);
        }
        else if(typeof ControllerDef === 'object')
        {
            instance = ControllerDef;
        }
        else if(typeof ControllerDef === 'string')
        {
            instance = this.get(ControllerDef);
        }

        if(instance && instance[method])
            return instance[method](req, res, next);
        else if(instance && typeof instance === 'function')
            return instance(req,res,next);
        else
            throw new Error("Controller ("+ControllerDef+") or method ("+method+") not found!");
    }
}

class BaseController {

    constructor(req, res, next)
    {
        this.res = res;
        this.req = req;
        this.next = next;
        this.body = req.body || null;
    }

    responseDefault(data)
    {
        if(!this.res)
            throw new Error("Response object not initialized. Are you calling this after the controller's 'handle' method?");

        return Output(this.res, new ResponseDefault(data));
    }

    responseError(key, message, code)
    {
        if(!this.res)
            throw new Error("Response object not initialized. Are you calling this after the controller's 'handle' method?");

        return Output(this.res, new ResponseError(key, message, code));
    }

    error(e)
    {
        reqErrHandler(e, this.req, this.res);
    }
}

var exportObject = {
    BaseController: BaseController,
    ResponseError: ResponseError,
    ResponseDefault: ResponseDefault,
    Output: Output,

    register: Registry.register,
    call: Registry.call,
    list: Registry.list,
    set: Registry.set,
    autoload: Registry.autoload
};

module.exports = exportObject;
