module.exports = function (param1, param2, options) {
    var ret;
    if (param1 === param2) { ret = options.fn(this); } else { ret = options.inverse(this); }
    return ret;
};