/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
    let index = 0;
    if(nums.indexOf(target) > -1 || nums.indexOf(target) === 0) {
        return nums.indexOf(target);
    } else {
        for(let i = 0, len = nums.length; i < len; i++) {
            if(nums[i] < target) {
                index = i + 1;
            }
        }
        return index;
    }
};