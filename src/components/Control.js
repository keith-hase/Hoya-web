import React, { Component } from "react";
import Sort from "./Sort";

class Control extends Component {

  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
    };
  }

  onChange = (event) => {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    this.setState({
      [name]: value,
    })
  }

  onSearch = () => {
    this.props.onSearch(this.state.keywords);
  }

 

  render() {
    var { keywords } = this.state;
    return (
  
      <div className="row mt-15">
        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập từ khóa..."
              name = "keywords"
              value={keywords}
              onChange={this.onChange }
            />
            <span className="input-group-btn">
              <button 
              className="btn btn-primary" 
              type="button"
              onClick={this.onSearch}
              >
                <span className="fa fa-search mr-5"></span>Tìm
              </button>
            </span>
          </div>
        </div>
        <Sort sortBy={this.props.sortBy} sortValue={this.props.sortValue} onSort={this.props.onSort}/>
      </div>
    );
  }
}
export default Control;
