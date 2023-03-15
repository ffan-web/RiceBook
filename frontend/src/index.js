import React from 'react'
import ReactDOM from 'react-dom'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import App from './App';
import { Reducer } from './reducers'

console.count('check this point')

const store = createStore(Reducer)

ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);