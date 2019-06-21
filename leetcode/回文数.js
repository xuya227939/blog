/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    var result = 0, numberBak = x;
    while(x != 0) {
       var number = x % 10;
       x = parseInt(x / 10);
       result = result * 10 + number;
    }
    if(result == numberBak && !(result.toString().includes('-'))) {
        return true;
    }
    return false;
};