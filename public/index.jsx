import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';


injectTapEventPlugin();


render((
  <Router history={browserHistory} routes={routes} />
), document.getElementById('app'));

