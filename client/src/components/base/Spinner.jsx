import React, { Component } from 'react';
import spinner from '../../images/Spinner.gif';

export default class Spinner extends Component{
  render(){
  return (
    <div>
      <img
        src={spinner}
        style={{ width: '200px', margin: 'auto', display: 'block' }}
        alt="Loading..."
      />
    </div>
  )
}
}
