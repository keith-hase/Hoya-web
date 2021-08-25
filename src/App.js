import "./App.css";
import TaskForm from "./components/TaskForm";
import Control from "./components/Control";
import Table from "./components/Table";
import React, { Component } from "react";
import _ from 'lodash';
class App extends Component {
  constructor(props) {
    super(props);
    /* Taọ cứng tasks ra trc lưu vào localStorage */
    this.state = {
      tasks: [] /* id: unique, name, status */,
      isDisplayForm: false,
      taskEditing: null,
      filter: {
        name: "",
        status: 0,
      },
      keywords: "",
      sortBy: "",
      sortValue: 1,
    };
  }
  onGenerateData = () => {
    var tasks = [
      {
        id: this.generateID(),
        name: "Học lập trình",
        status: true,
      },
      {
        id: this.generateID(),
        name: "Đi Bơi",
        status: false,
      },
      {
        id: this.generateID(),
        name: "Ngủ",
        status: true,
      },
    ];
    console.log(tasks);

    /* Đây là cách lưu trữ tại localStorage. Nên khuyên lưu trữ dạng String hơn dạng Object. */
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Phương thức gọi component  để gắn vào, gọi 1 lần
  componentWillMount() {
    // nên kiểm tra các storage trc khi lấy dữ liệu
    /* Đây là phương thức lưu dữ liệu tạm thời tại local sau này sẽ thực hiện lưu trữ lên server */
    if (localStorage && localStorage.getItem("tasks")) {
      var tasksvar = JSON.parse(localStorage.getItem("tasks"));
      this.setState({
        tasks: tasksvar,
      });
    }
  }
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  generateID() {
    return (
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4()
    );
  }
  onToggleForm = () => {
    this.setState({
      isDisplayForm: !this.state.isDisplayForm,
      taskEditing: null,
    });
  };

  onCloseForm = () => {
    this.setState({
      isDisplayForm: false,
      taskEditing: null,
    });
    console.log("Close form");
  };

  //Lấy dữ liệu từ Task Form ra ngoài dưới dạng data
  onSubmit = (data) => {
    // Thực hiện tạo ra 1 object mới thêm dữ liệu vào như DAO thêm vào
    // Hoặc ta có thể tạo thẳng ID
    var { tasks } = this.state;
    // Kiểm tra id đã có chưa nếu chưa có thì sẽ là action thêm
    // Nếu có rồi thì sẽ chuyển sang action update tại id đó

    if (data.id === "") {
      data.id = this.generateID();
      tasks.push(data);
    } else {
      var index = this.findIndex(data.id);
      tasks[index] = data;
    }
    // Sau khi phân biệt hành động và thực hiện phù hợp ta cập nhật lại state và đưa
    // vào storage
    this.setState({
      tasks: tasks,
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  onUpdateStatus = (id) => {
    console.log(id);
    var index = this.findIndex(id);
    var { tasks } = this.state;

    if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks: tasks,
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  };

  findIndex = (id) => {
    var { tasks } = this.state;
    var result = -1;
    //Duyệt tìm vị trí của status cần update
    tasks.forEach((task, index) => {
      if (task.id === id) {
        result = index;
      }
    });
    return result;
  };

  onDelete = (id) => {
    var index = this.findIndex(id);
    var { tasks } = this.state;
    if (index !== -1) {
      tasks.splice(index, 1);
      this.setState({
        tasks: tasks,
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    this.onCloseForm();
  };

  onUpdate = (id) => {
    var { tasks } = this.state;
    var index = this.findIndex(id);
    var taskEditing = tasks[index];
    this.setState(
      {
        taskEditing: taskEditing,
      },
      () => {
        console.log(this.state.taskEditing);
      }
    );
    this.onShowForm();
  };
  onShowForm = () => {
    this.setState({
      isDisplayForm: true,
    });
  };

  // onFilter này nhận dữ liệu từ filter vào để xử lý như
  // Gồm FilterName và filterStatus
  onFilter = (filterName, filterStatus) => {
    filterStatus = parseInt(filterStatus, 10);
    // tiến hành filter dữ liệu
    this.setState({
      filter: {
        name: filterName,
        status: filterStatus,
      },
    });
  };

  onSearch = (keywords) => {
    this.setState({
      keywords: keywords,
    });
  };

  onSort = (sortBy, sortValue) => {
    this.setState({
      sortBy: sortBy,
      sortValue: sortValue,
    });
  };

  render() {
    var {
      tasks,
      isDisplayForm,
      taskEditing,
      filter,
      keywords,
      sortBy,
      sortValue,
    } = this.state; // var tasks = this.state.tasks;
    //thực hiện kiểm tra và lọc dữ liệu
    if (filter) {
      if (filter.name) {
        tasks = tasks.filter((task) => {
          return (
            task.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1
          );
        });
      }
      tasks = tasks.filter((task) => {
        if (filter.status === 0) {
          return task;
        } else {
          return task.status === (filter.status === 1 ? true : false);
        }
      });
      // Phương thức bên dưới kiểm tra != null, != undefine, != 0 => ko phù hợp với dữ liệu filter này
      /*    if(filter.status){
    
      } */
    }
    if (keywords) {
      tasks = tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(keywords.toLowerCase()) !== -1;
      });
    }
    console.log(this.state.sortBy + " : " + this.state.sortValue);
    var elmTaskForm = isDisplayForm ? (
      <TaskForm
        onSubmit={this.onSubmit}
        onCloseForm={this.onCloseForm}
        taskEditing={taskEditing}
      />
    ) : (
      ""
    );
    if (sortBy === "name") {
      tasks.sort((a, b) => {
        if (a.name > b.name) return sortValue;
        else if (a.name < b.name) return -sortValue;
        else return 0;
      });
    } else {
      tasks.sort((a, b) => {
        if (a.status > b.status) return -sortValue;
        else if (a.status < b.status) return sortValue;
        else return 0;
      });
    }

    return (
      <div className="App">
        <div className="container">
          <div className="text-center">
            <h1>Quản Lý Công Việc</h1>
            <hr />
          </div>
          <div className="row">
            <div
              className={
                isDisplayForm ? "col-xs-4 col-sm-4 col-md-4 col-lg-4" : ""
              }
            >
              {elmTaskForm}
            </div>
            <div
              className={
                isDisplayForm
                  ? "col-xs-8 col-sm-8 col-md-8 col-lg-8"
                  : "col-xs-12 col-sm-12 col-md-12 col-lg-12"
              }
            >
              <button
                type="button"
                className="btn btn-primary"
                id="btnAdd"
                onClick={this.onToggleForm}
              >
                <span className="fa fa-plus mr-5"></span>Thêm Công Việc
              </button>

              <Control
                onSearch={this.onSearch}
                sortBy={sortBy}
                sortValue={sortValue}
                onSort={this.onSort}
              />
              <Table
                tasks={tasks}
                onUpdateStatus={this.onUpdateStatus}
                onDelete={this.onDelete}
                onUpdate={this.onUpdate}
                onFilter={this.onFilter}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
