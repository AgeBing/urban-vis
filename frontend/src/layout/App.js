import React, { Component } from 'react';
import './App.scss';
import MapView from './MapView'
import QueryView from './QueryView'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
      return (
        <div className="app">
            <div className='map-area' >
              <MapView />
            </div>
            <div className='query-area' >
              <QueryView />
            </div>
        </div>
      );
    }
}

export default  App
