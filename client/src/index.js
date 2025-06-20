import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import commonReducer from './reducers/commonReducer';
// import orderDetailsReducer from './reducers/orderDetailsReducer';
// import frontEndReducer from './reducers/frontEndReducer';

const store = configureStore({
  reducer: {
    commonReducer: commonReducer,
    // orderDetailReducer: orderDetailsReducer,
    // frontEndReducer: frontEndReducer
  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
