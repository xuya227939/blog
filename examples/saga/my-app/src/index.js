import React from 'react';
import ReactDOM from 'react-dom';
import Home from './pages/Home/index';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';
import homeRedu from './reducers/HomeRedu';

import homeSaga from './sagas/HomeSaga';
const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
// const middleware = routerMiddleware(history);
const store = createStore (
  combineReducers({
    homeRedu,
    router: routerReducer
  }),
  // applyMiddleware(middleware)
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(homeSaga);
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router>
        <Route exact path="/" component={Home}/>
      </Router>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);