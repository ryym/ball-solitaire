import React from 'react';
import { render } from 'react-dom';
import { injectGlobal } from 'emotion';
import { App } from './components/App';

injectGlobal({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
});

render(<App />, document.getElementById('root'));
