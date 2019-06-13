/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function(s) {
    let letter = s.split(' ');
    for(let i = letter.length - 1; i >= 0; i--) {
        if(letter[i].match(/[a-z]/i)) {
            return letter[i].length;
        }
    }
    return 0;
};