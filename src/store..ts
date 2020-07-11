import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import saga from './saga';

const sagaMiddleware = createSagaMiddleware();

export const initStore = () => {
    const store = createStore(
        rootReducer as any,
        composeWithDevTools(
            applyMiddleware(sagaMiddleware)
        )
    );
    sagaMiddleware.run(saga);
    return store;
}

