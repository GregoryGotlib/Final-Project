import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getProfile } from '../../actions/profileAction';
import Spinner from '../base/Spinner';


class SearchHistory extends Component {

constructor(props){
    super(props);
}

componentDidMount(){
    console.log('SH didmount')
    this.props.getProfile();
}

  render() {
   
    console.log(this.props.profile.profile)
    const profile = this.props.profile.profile
    const loading = this.props.profile.loading
    
    let files;

    if(profile === null || loading){
        files = <Spinner/>
      }
    else{
     files = profile.files.map(file=>(
        <tr key={file._id}>
            <td>
                {file.index}
            </td>
            <td>
                {file.date}
            </td>
            <td>
                {file.content}
            </td>
        </tr>
    ))
    
    }
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
                                        date
                                    </th>
                                    <th scope="row">
                                        Searched Sequence
                                    </th>
                                </tr>
                            </thead>
                            <tbody>                 
                              {files}              
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
    </div>
    )
  }
}

const mapStateToProps = (state)=>({
    profile:state.profile,
  });
  
  export default connect(mapStateToProps,{ getProfile})(SearchHistory);
