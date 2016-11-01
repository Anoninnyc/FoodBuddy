import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { Router, browserHistory } from 'react-router';

injectTapEventPlugin();

render(<App />,
  document.getElementById('app')
);

