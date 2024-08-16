import React, { Component } from "react";
import "./Todocss.css";

export default class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      addTask: true,
      input: "", // Initial input value corrected
      array: [],
      inputTime: "",
      inputTimearray: [],
      startHour: [],
      startMin: [],
      hourDiff: [],
      minDiff: [],
      model: false,
      selectedTaskIndex: null,
    };
  }

  // Toggle input visibility
  inputClick = () => {
    this.setState((prevState) => ({
      isActive: !prevState.isActive,
      addTask: !prevState.addTask,
    }));
  };

  componentDidMount() {
    this.endTime(); // Run immediately on mount
    this.interval = setInterval(this.endTime, 60000); // Run every minute
  }

  componentWillUnmount() {
    clearInterval(this.interval); // Clear interval when the component unmounts to avoid memory leaks
  }

  endTime = () => {
    const date = new Date();
    const endHour = date.getHours();
    const endMin = date.getMinutes();

    const hourDiff = this.state.startHour.map(
      (startHour) => endHour - startHour
    );
    const minDiff = this.state.startMin.map((startMin) =>
      Math.abs(endMin - startMin)
    );

    this.setState({
      hourDiff,
      minDiff,
    });
  };

  delete = (key) => {
    this.setState({
      array: this.state.array.filter((_, index) => index !== key),
      inputTimearray: this.state.inputTimearray.filter((_, index) => index !== key),
      startHour: this.state.startHour.filter((_, index) => index !== key),
      startMin: this.state.startMin.filter((_, index) => index !== key),
      hourDiff: this.state.hourDiff.filter((_, index) => index !== key),
      minDiff: this.state.minDiff.filter((_, index) => index !== key),
    });
  };

  handleEditClick = (index) => {
    this.setState({
      model: true,
      selectedTaskIndex: index,
      input: this.state.array[index], // Pre-fill with existing data
      inputTime: this.state.inputTimearray[index], // Pre-fill with existing data
    });
  };

  // Update input values in state
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // Prevent form submission and update state
  storeItems = (event) => {
    event.preventDefault();
    const date = new Date();
    const { input, inputTime, selectedTaskIndex, array, inputTimearray } = this.state;

    if (selectedTaskIndex !== null) {
      // Editing existing task
      const updatedArray = [...array];
      const updatedTimeArray = [...inputTimearray];

      updatedArray[selectedTaskIndex] = input;
      updatedTimeArray[selectedTaskIndex] = inputTime;

      this.setState({
        array: updatedArray,
        inputTimearray: updatedTimeArray,
        model: false, // Close modal after edit
        selectedTaskIndex: null,
      });
    } else {
      // Adding new task
      this.setState((prevState) => ({
        array: [...prevState.array, input],
        inputTimearray: [...prevState.inputTimearray, inputTime],
        startHour: [...prevState.startHour, date.getHours()], // Add the hour to the array
        startMin: [...prevState.startMin, date.getMinutes()], // Add the minute to the array
        input: " ",
        inputTime: " ",
      }));
      
    }
  };

  render() {
    const { input, array, isActive, inputTime, inputTimearray, addTask, model } = this.state;

    return (
      <div className="partent">
        {model && (
          <div className='modal'>
            <div className='modal-content'>
              <h2>Edit Task</h2>
              <form onSubmit={this.storeItems}>
                <input
                  type="text"
                  name="input"
                  value={input}
                  onChange={this.handleChange}
                />
                <input
                  type="text"
                  name="inputTime"
                  value={inputTime}
                  onChange={this.handleChange}
                />
                <button type="submit">Save</button>
                <button onClick={() => this.setState({ model: false })}>Close</button>
              </form>
            </div>
          </div>
        )}
        <div className="Cointainer todo">
          <div className="row todolist">
            <h1>TODOLIST</h1>
            <hr />
          </div>

          <div className="Today">
            <h2>Today</h2>
            {array.map((data, index) => (
              <div key={index} className="task row d-flex">
                <div className="col d-flex dot">
                  <div className="bt"></div>
                  {data}
                </div>
                <div className="col time">{inputTimearray[index]}</div>
                <div className="col">
                  <i
                    className="fa-solid fa-trash delete"
                    onClick={() => this.delete(index)}
                  ></i>
                  <i
                    className="fa-regular fa-pen-to-square"
                    onClick={() => this.handleEditClick(index)}
                  ></i>
                </div>
                <div className="col ago">
                  {this.state.hourDiff[index]}h {this.state.minDiff[index]}min ago
                </div>
              </div>
            ))}

            <div className="task row d-flex">
              <div className="col d-flex dot add_task">
                <div className="bt_add">
                  <i className="fa-solid fa-circle-plus"></i>
                </div>
                <div className={addTask ? "addTaskActive" : "inputactive"}>
                  <h5 onClick={this.inputClick}>Add task for today</h5>
                </div>
                <div className={isActive ? "hide" : "inputactive"}>
                  <h5 onClick={this.inputClick}>Hide</h5>
                </div>
              </div>
            </div>
            <div className={isActive ? "input" : "inputactive"}>
              <form onSubmit={this.storeItems}>
                <div className="row d-flex">
                  <div className="col d-flex inputInsideDiv">
                    <input
                      className="inputField"
                      type="text"
                      name="input"
                      value={input}
                      onChange={this.handleChange}
                    />
                    <div className="col requiredtime">
                      <input
                        name="inputTime"
                        type="text"
                        value={inputTime}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col submitButton">
                    <button type="submit">Add</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
