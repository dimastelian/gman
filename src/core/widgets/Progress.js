const ProgressBar = require('progress');

const _ = require('lodash');

module.exports = {
    bar: function(text, total, options){

        var defaults = {
            template: '[:bar] :percent :etas - :text',
            totla: 0,
            width: 30
        }

        var opts = {};

        if(_.isNumber(total))
            defaults.total = total;

        if(_.isObject(options))
            _.assign(opts, defaults, options);
        else
            _.assign(opts, defaults);

        if(_.isObject(total))
            _.assign(opts, total);

        var tpl = _.replace(opts.template, ':text', text);

        var pbar = new ProgressBar(tpl, opts);

        return pbar;
    }
}
