/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    var result = [];
    var isReturn = false;
    for(var i = 0; i < nums.length; i++) {
       for(var j = 0;j < nums.length; j++) {
           if(nums[i] + nums[j] == target && i != j) {
                result.push(i, j);
                var isReturn = true;
                break;
           }
       }
       if(isReturn) {
           break;
       }
    }
    return result;
};