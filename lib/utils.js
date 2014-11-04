/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

exports.errors = function(errors) {
        var keys = Object.keys(errors),
            errs = [];

        // if there is no validation error, just display a generic error
        if (!keys) {
            return ['Oops! There was an error'];
        }

        keys.forEach(function(key) {
            errs.push(errors[key].message);
        });

        return errs;
    },

    /**
     * Index of object within an array
     *
     * @param {Array} arr
     * @param {Object} obj
     * @return {Number}
     * @api public
     */

    exports.indexof = function(arr, obj) {
        var keys = Object.keys(obj),
            index = -1; // not found initially

        arr.filter(function(doc, idx) { // filter the collection with the given criterias
            var i, matched = 0; // keep a counter of matched key/value pairs

            for (i = keys.length - 1; i >= 0; i -= 1) { // loop over criteria
                if (doc[keys[i]] === obj[keys[i]]) {
                    matched += 1;

                    if (matched === keys.length) { // check if all the criterias are matched
                        index = idx;
                        return idx;
                    }
                }
            }
        });
        return index;
    },

    /**
     * Find object in an array of objects that matches a condition
     *
     * @param {Array} arr
     * @param {Object} obj
     * @param {Function} cb - optional
     * @return {Object}
     * @api public
     */

    exports.findByParam = function(arr, obj, cb) {
        var index = exports.indexof(arr, obj);
        if (index !== -1 && typeof cb === 'function') {
            return cb(undefined, arr[index]);
        } else if (index !== -1 && !cb) {
            return arr[index];
        } else if (index === -1 && typeof cb === 'function') {
            return cb('not found');
        }
        // else undefined is returned
    },

    /**
     * 时间格式化 返回格式化的时间
     * @param date {object}  可选参数，要格式化的data对象，没有则为当前时间
     * @param fomat {string} 格式化字符串，例如：'YYYY年MM月DD日 hh时mm分ss秒 星期' 'YYYY/MM/DD week' (中文为星期，英文为week)
     * @return {string} 返回格式化的字符串
     *
     * 例子:
     * formatDate(new Date("january 01,2012"));
     * formatDate(new Date());
     * formatDate('YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY-MM-DD week');
     * formatDate(new Date("january 01,2012"),'YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY/MM/DD week');
     *
     * 格式：
     *    YYYY：4位年,如1993
     *　　YY：2位年,如93
     *　　MM：月份
     *　　DD：日期
     *　　hh：小时
     *　　mm：分钟
     *　　ss：秒钟
     *　　星期：星期，返回如 星期二
     *　　周：返回如 周二
     *　　week：英文星期全称，返回如 Saturday
     *　　www：三位英文星期，返回如 Sat
     */
    exports.formatDate = function(date, format) {
        if (arguments.length < 2 && !date.getTime) {
            format = date;
            date = new Date();
        }
        typeof format !== 'string' && (format = 'YYYY年MM月DD日 hh时mm分ss秒');
        var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '日', '一', '二', '三', '四', '五', '六'];
        return format.replace(/YYYY|YY|MM|DD|hh|mm|ss|星期|周|www|week/g, function(a) {
            switch (a) {
                case "YYYY":
                    return date.getFullYear();
                case "YY":
                    return (date.getFullYear() + "").slice(2);
                case "MM":
                    return date.getMonth() + 1;
                case "DD":
                    return date.getDate();
                case "hh":
                    return date.getHours();
                case "mm":
                    return date.getMinutes();
                case "ss":
                    return date.getSeconds();
                case "星期":
                    return "星期" + week[date.getDay() + 7];
                case "周":
                    return "周" + week[date.getDay() + 7];
                case "week":
                    return week[date.getDay()];
                case "www":
                    return week[date.getDay()].slice(0, 3);
            }
        });
    };
