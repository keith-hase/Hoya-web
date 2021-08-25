import React, { Component } from "react";

class TaskForm extends Component {
  /* Thực hiện tạo ra state để lưu giữ các giá trị từ TaskForm */
  // Để tạo ra State ta cần có constructor
  constructor(props) {
    super(props);
    this.state = {
      id : "",
      name: "",
      status: false,
    };
  }

  onCloseForm = () => {
    this.props.onCloseForm();
  };

  onChange = (event) => {
    var target = event.target;
    var name = target.name;
    var value = target.value;
    // Hoặc cũng có thể ép kiểu tại đây
    if(name === 'status'){
      value = target.value === 'true' ? true :false;
    }
    this.setState({
      [name] : value
    });
  }
  // thực hiện truyền dữ liệu vào form ở đây
  componentWillMount() {
    if(this.props.taskEditing !== null){
      this.setState({
        id : this.props.taskEditing.id,
        name :  this.props.taskEditing.name,
        status : this.props.taskEditing.status,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps && nextProps.taskEditing){
      this.setState({
        id : nextProps.taskEditing.id,
        name :  nextProps.taskEditing.name,
        status : nextProps.taskEditing.status,
      });
    }
  }

  //Hàm onSubmit dùng để gửi các state chứa giá trị đi thông qua props
  // và hàm event.preventDefault dùng để giữ hiện trạng sau khi có event diễn ra
  // Lưu ý khi chúng ta truyền các kiểu boolean hay khác String ta sẽ phải ép kiểu cẩn thận kiểu 
  // dữ liệu truyền vào phải đc ép kiểu và phù hợp như boolean phải truyền từ String về boolean 
  onSubmit = (event) => {
    event.preventDefault();
    //Cách ép kiểu trong taskForm để truyền ra phù hợp
    this.props.onSubmit(this.state);
    // Sau khi submit xong sẽ hủy bỏ và lưu form
    this.onClear();
    this.onCloseForm();
  }

  onClear = () =>{
    this.setState({
      name : '',
      status : false,
    })
  }

  render() {
    var { id } = this.state;
    return (
      <div className="panel panel-warning">
        <div className="panel-heading">
          <h3 className="panel-title">
            { id !== ''? 'Cập nhật công việc' : 'Thêm công việc'}
            <span
              id="icon-x"
              className="fa fa-times-circle text-right"
              aria-hidden="true"
              onClick={this.onCloseForm}
            ></span>
          </h3>
        </div>
        <div className="panel-body">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Tên :</label>
              {/* Ô input lưu giữ giá trị vào vào state name */}
              <input
                type="text"
                className="form-control"
                name="name"
                value={this.state.name}
                onChange={this.onChange}
              />
            </div>
            <label>Trạng Thái :</label>
            <select
              className="form-control"
              name ="status"
              value={this.state.status}
              onChange={this.onChange}
            >
              <option value={true}>Kích Hoạt</option>
              <option value={false}>Ẩn</option>
            </select>
            <br />
            <div className="text-center">
              <button type="submit" className="btn btn-warning">
                {id !== '' ? 'Cập nhật' : 'Thêm'}
              </button>
              &nbsp;
              <button type="button" className="btn btn-danger" onClick={this.onClear}>
                Hủy Bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default TaskForm;
