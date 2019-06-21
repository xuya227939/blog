/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    if(x == 0) {
        return 0;
    }
    var number = 0;
    if(typeof x == 'number') {
        while(x != 0) {
            var mod = x % 10;
            x = parseInt(x / 10);
            number = number * 10 + mod;
        }
        if(number <= Math.pow(-2, 31) || number >= Math.pow(2, 31) - 1) {
            return 0;
        }
        return number;
    }
};