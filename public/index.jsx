import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

injectTapEventPlugin();

render(<App />,
  document.getElementById('app')
);
