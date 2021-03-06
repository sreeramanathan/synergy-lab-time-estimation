import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { register } from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
register({
  onUpdate: () => {
    if (window.confirm('Website has been updated, click OK to refresh')) {
      window.location.reload();
    }
  },
});
