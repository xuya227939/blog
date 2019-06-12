/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
    let j = 1;
    for(let i = digits.length - 1; i >= 0; i--) {
        let temp = digits[i] + j;
        if(temp > 9) {
            digits[i] = 0;
        } else {
            j = 0;
            digits[i] = temp;
        }
    }
    
    if(j > 0) {
        digits.unshift(1);
    }
    
    return digits;
};