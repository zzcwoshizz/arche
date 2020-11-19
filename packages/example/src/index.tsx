import { ArcheProvider } from '@arche-polkadot/react-core';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.render(
  <ArcheProvider>
    <App />
  </ArcheProvider>,
  document.getElementById('root')
);
