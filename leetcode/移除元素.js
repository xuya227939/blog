/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    if(nums.length > 0) {
     	for(let i = 0; i <= nums.length; i++) {
       		if(nums[i] == val) {
          		nums.splice(i, 1);
                i = -1;
       		}
    	}
    	return nums.length; 
    }
    return nums.length;
};