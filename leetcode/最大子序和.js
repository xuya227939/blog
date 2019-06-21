/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let max = nums[0];
    let cur = 0;
    for(let i = 0; i < nums.length; i++) {
        if(cur > 0) {
            cur += nums[i];
        } else {
            cur = nums[i];
        }
        
        if(cur >= max) {
            max = cur;   
        }
    }
    return max;
};