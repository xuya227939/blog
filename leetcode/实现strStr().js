/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
    if(needle == '') {
        return 0;
    }
    return haystack.indexOf(needle) >= 0 ? haystack.indexOf(needle) : -1;
};