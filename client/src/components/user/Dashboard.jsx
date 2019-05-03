import React, { Component } from 'react'

export default class Dashboard extends Component {
  render() {
    return (
      <div className="dashContainer" style={{marginTop:'200px',marginBottom:'250px',marginLeft:'20%'}}> 
        <div className="row">
          <div className="dash">
            <a href="/profiledash" className="btn btn-info mr-5 mb-3 shadow-lg p-3 rounded" style={{width:'270px',height:'150px',lineHeight:'125px'}}>Profile</a>
            <a href="" className="btn btn-success mr-5 mb-3 shadow-lg p-3 rounded" style={{width:'270px',height:'150px',lineHeight:'125px'}}>Protein Data Base</a>
            <a href="" className="btn btn-primary mr-5 mb-3 shadow-lg p-3 rounded" style={{width:'270px',height:'150px',lineHeight:'125px'}}>Find Protein Relatedness</a>
          </div>
        </div>
      </div>
    )
  }
}
