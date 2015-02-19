module.exports = function (options) {
    var ret = "";
    var i;
    for (i = 0; i < options.hash.count; i++) {
        ret = ret + options.fn(this);
    }
    return ret;
};