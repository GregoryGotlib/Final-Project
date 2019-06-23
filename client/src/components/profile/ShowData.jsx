import React, { Component } from "react";
import Sigma from 'react-sigma/lib/Sigma'
import LoadTEXT from 'react-sigma/lib/LoadGEXF'
import RelativeSize from 'react-sigma/lib/RelativeSize'
import graph from './graph.text'
export default class ShowData extends Component {
  render() {
    return (
      <Sigma>
        <LoadTEXT url={graph}>
          <RelativeSize initialSize={8} />
        </LoadTEXT>
      </Sigma>
    );
  }
}
