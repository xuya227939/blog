import { combineReducers } from 'redux';
const homeRedu = (state = 0, action) => {
  switch(action.type) {
    case 'ADD':
      return state + 1;
    break;
    case 'REDUCE':
      return state - 1;
    default:
      return state;
  }
}
export default homeRedu;