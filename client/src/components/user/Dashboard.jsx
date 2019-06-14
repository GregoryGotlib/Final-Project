import React, { Component } from 'react'

export default class Dashboard extends Component {
  render() {
    return (
      <div className="container">
      <div className="card mt-20 shadow-sm p-3 mb-2 bg-white rounded text-center"><h1 className="display-4">User Dashboard</h1> </div>
      <div className="card  mt-20 shadow p-3 bg-white rounded">
      <div className="dashContainer" style={{marginTop:'150px',marginBottom:'250px',marginLeft:'75px'}}> 
      
        <div className="row">
            <div className="col-lg-4">
              <a href="/profiledash" className="btn btn-info  mb-3 shadow-lg p-3 rounded" style={{width:'270px',height:'150px',lineHeight:'125px'}}>Profile</a>
            </div>
            <div className="col-lg-4">
              <a href="" className="btn btn-success mb-3 shadow-lg p-3 rounded" style={{width:'270px',height:'150px',lineHeight:'125px'}}>Protein Data Base</a>
            </div>
            <div className="col-lg-4">
              <a href="/searchprotein" className="btn btn-primary  mb-3 shadow-lg p-3 rounded" style={{width:'270px',height:'150px',lineHeight:'125px'}}>Find Protein Relatedness</a>
            </div>
          </div>
      </div>
      </div>
    </div>
    )
  }
}
