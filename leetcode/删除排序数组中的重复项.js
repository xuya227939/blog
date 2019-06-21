/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    if(nums.length == 0) {
        return nums.length;
    }

    for(var i = 0, len = nums.length; i < len; i++) {
        for(let j = i + 1, len = nums.length; j <= len; j++) {
            if(nums[i] == nums[j]) {
                nums.splice(i, 1);
                i--;
                break;
            }
        }
    }
    return nums.length;
};