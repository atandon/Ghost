// # foreachPage Helper
// Usage: `{{#foreachPosts data}}{{/foreachPage}}`
//
// Block helper designed for looping through page posts w/ ordering

var hbs             = require('express-hbs'),
    errors          = require('../errors'),

    hbsUtils        = hbs.handlebars.Utils,
    foreachPage;

var pageOrder = ['Companies', 'About us', 'Team', 'News'];

foreachPage = function (context, options) {
    if (!options) {
        errors.logWarn('Need to pass an iterator to #foreachPage');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        columns = options.hash.columns,
        data,
        contextPath,
        htmlArr = [],
        ret,
        pos;

    if (options.data && options.ids) {
        contextPath = hbsUtils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (hbsUtils.isFunction(context)) {
        context = context.call(this);
    }

    if (options.data) {
        data = hbs.handlebars.createFrame(options.data);
    }

    function execIteration(field, index, last) {
        if (data) {
            data.key = field;
            data.index = index;
            data.number = index + 1;
            data.first = index === 0;
            data.last = !!last;
            data.even = index % 2 === 1;
            data.odd = !data.even;
            data.rowStart = index % columns === 0;
            data.rowEnd = index % columns === (columns - 1);

            if (contextPath) {
                data.contextPath = contextPath + field;
            }
        }

        pos = pageOrder.indexOf(context[field].title);

        if(pos >= 0) {
            ret = fn(context[field], {
                data: data,
                blockParams: hbsUtils.blockParams([context[field], field], [contextPath + field, null])
            });

            htmlArr[pos] = ret;
        }
    }

    function iterateArray(context) {
        var j;
        for (j = context.length; i < j; i += 1) {
            execIteration(i, i, i === context.length - 1);
        }
    }

    function iterateObject(context) {
        var priorKey,
            key;

        for (key in context) {
            if (context.hasOwnProperty(key)) {
                // We're running the iterations one step out of sync so we can detect
                // the last iteration without have to scan the object twice and create
                // an itermediate keys array.
                if (priorKey) {
                    execIteration(priorKey, i - 1);
                }
                priorKey = key;
                i += 1;
            }
        }
        if (priorKey) {
            execIteration(priorKey, i - 1, true);
        }
    }

    if (context && typeof context === 'object') {
        if (hbsUtils.isArray(context)) {
            iterateArray(context);
        } else {
            iterateObject(context);
        }
    }

    if (i === 0) {
        ret = inverse(this);
    }

    return htmlArr.join(' ');
};

module.exports = foreachPage;
