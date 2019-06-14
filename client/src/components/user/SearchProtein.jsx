import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { searchProteinBy } from "../../actions/dashboardAction";
import { connect } from "react-redux";
import "./SearchProtein.css";

class SearchProtein extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    byName: "",
    byID: "",
    bySeq: ""
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    if (this.state.byName) {
      const newData = {
        byName: this.state.byName
      };
      console.log("client", this.props.history);
      this.props.searchProteinBy("name", newData, this.props.history);
    } else if (this.state.bySeq) {
      const newData = {
        bySeq: this.state.bySeq
      };
      this.props.searchProteinBy("seq", newData, this.props.history);
    } else if (this.state.byID) {
      const newData = {
        byID: this.state.byID
      };
      this.props.searchProteinBy("id", newData, this.props.history);
    } else {
      window.alert("Please provide data");
    }
  };

  render() {
    return (
      <div className="container">
        <div className="card mt-20 shadow-sm p-3 mb-2 bg-white rounded text-center">
          <h1 className="display-4">Search Protein</h1>
        </div>
        <div className="card mt-20 card mt-20 shadow p-3 mb-5 bg-white rounded">
          <div className="searchhistory">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <button
                    data-toggle="modal"
                    data-target="#searchModalByName"
                    className="btn btn-success  mb-3 shadow-lg p-3 rounded"
                    style={{
                      width: "270px",
                      height: "100px",
                      lineHeight: "70px",
                      color: "white"
                    }}
                  >
                    Search by name
                  </button>
                </div>
                <div className="col-md-12">
                  <button
                    data-toggle="modal"
                    data-target="#searchModalById"
                    className="btn btn-primary  mb-3 shadow-lg p-3 rounded"
                    style={{
                      width: "270px",
                      height: "100px",
                      lineHeight: "70px",
                      color: "white"
                    }}
                  >
                    Search by ID
                  </button>
                </div>
                <div className="col-md-12">
                  <button
                    data-toggle="modal"
                    data-target="#searchModalBySeq"
                    className="btn btn-secondary  mb-3 shadow-lg p-3 rounded"
                    style={{
                      width: "270px",
                      height: "100px",
                      lineHeight: "70px",
                      color: "white"
                    }}
                  >
                    Search by sequence
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal fade"
            id="searchModalByName"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Search Protein By Name
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div className="input-group">
                    <input
                      name="byName"
                      class="form-control"
                      type="text"
                      placeholder="Search"
                      onChange={this.onChange}
                      value={this.state.byName}
                    />
                    <span class="input-group-button">
                      <button
                        class="btn btn-outline-secondary"
                        type="submit"
                        onClick={this.onSubmit}
                        data-dismiss="modal"
                      >
                        <i class="fa fa-search" />
                      </button>
                    </span>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal fade"
            id="searchModalById"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel2"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel2">
                    Search Protein By ID
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div className="input-group">
                    <input
                      name="byID"
                      onChange={this.onChange}
                      value={this.state.byID}
                      class="form-control"
                      type="text"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <span class="input-group-button">
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        onClick={this.onSubmit}
                        data-dismiss="modal"
                      >
                        <i class="fa fa-search" />
                      </button>
                    </span>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="modal fade"
            id="searchModalBySeq"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel3"
            aria-hidden="true"
          >
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel3">
                    Search Protein By Sequence
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div className="input-group">
                    <input
                      name="bySeq"
                      onChange={this.onChange}
                      value={this.state.bySeq}
                      class="form-control"
                      type="text"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <span class="input-group-button">
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        onClick={this.onSubmit}
                        data-dismiss="modal"
                      >
                        <i class="fa fa-search" />
                      </button>
                    </span>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dashboard: state.dashboard
});

export default connect(
  mapStateToProps,
  { searchProteinBy }
)(withRouter(SearchProtein));
