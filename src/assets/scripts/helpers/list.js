module.exports = function (num, options) {
    var ret = "";
    var i;
    for (i = 0; i < num; i++) { ret = ret + "<li>" + options.fn(this) + "</li>"; }
    return ret;
};