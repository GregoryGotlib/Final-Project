import React, { Component } from 'react'

export default class SearchHistory extends Component {
  render() {
    return (
    <div className="container">
        <div className="card mt-20 shadow-sm p-3 mb-2 bg-white rounded text-center"><h1 className="display-4">Searched History</h1> </div>
        <div className="card mt-20 card mt-20 shadow p-3 mb-5 bg-white rounded">
        <div className="searchhistory">
            <div className="container">
                
                        <table className="table table-hover text-center">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="row">
                                        #
                                    </th>
                                    <th scope="row">
                                        Protein Name
                                    </th>
                                    <th scope="row">
                                        Display Data
                                    </th>
                                    <th scope="row">
                                        Download Data
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Amino Acid</td>
                                    <td>Click Here</td>
                                    <td>Click Here</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Some Protein</td>
                                    <td>Click Here</td>
                                    <td>Click Here</td>
                                </tr>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    </div>
    )
  }
}
