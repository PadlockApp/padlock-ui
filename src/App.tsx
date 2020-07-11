import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { init } from './actions';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  return (
    <div>
      Hello.
    </div>
  );
}

export default App;
