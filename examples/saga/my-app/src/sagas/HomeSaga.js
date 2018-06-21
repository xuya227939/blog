import { call, put, takeEvery, takeLatest, delay } from 'redux-saga/effects';
export function* addFun() {
  yield put({
    type: "ADD"
  });
}

export function* reduceFun() {
  yield put({
    type: "REDUCE"
  }); 
}

function* homeSaga() {
  yield takeEvery("ADD_SAGA", addFun);
  yield takeEvery("REDUCE_SAGA", reduceFun);
}

export default homeSaga;