const add = (dispatch) => {
  dispatch({
    type:'ADD_SAGA'
  });
}

const reduce = (dispatch) => {
  dispatch({
    type: 'REDUCE_SAGA'
  });
}

export { add, reduce };