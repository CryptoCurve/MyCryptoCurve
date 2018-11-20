// Application styles must come first in order, to allow for overrides
import 'font-awesome/scss/font-awesome.scss';
// import 'sass/styles.scss';
import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import Root from './Root';
import { configuredStore } from './store';
import consoleAdvertisement from './utils/consoleAdvertisement';

const appEl = document.getElementById('app');

render(<Root store={configuredStore} />, appEl);
// render(<div />, appEl);

if (process.env.NODE_ENV === 'production') {
  consoleAdvertisement();
}
