import React, { Component } from 'react';

import Modal from 'react-modal';
import { ref, firebaseAuth } from '../config/firebase';

require('../index.css');

export default class ListModal extends Component {

  state={
    error: '',
    title: '',
    task: '',
    tasks: [],
    addTask: false,
  }

  saveList() {
    const { title, tasks } = this.state;

    if (title.length < 1) {
      this.setState({ error: 'Please include a title for your list.'});
      return;
    }

    const user = firebaseAuth().currentUser;
    const listRef = ref.child(`users/${user.uid}/lists`);
    // save new list to firebase;
    const time = new Date().getTime();
    const myList = {title, tasks: []}
    listRef.child(`${time}`).update(myList);
    this.closeModal();
  }

  setTitle(title) {
    this.setState({ title });
  }

  newTask(task) {
    this.setState({ task });
  }

  saveTask() {
    let allTasks = [...this.state.tasks];
    const task = {task: this.state.task, completed: false, deleted: false};
    allTasks.push(task);
    this.setState({ tasks: allTasks, task: '', addTask: false });
  }

  closeModal() {
    this.setState({
      error: '',
      title: '',
      tasks: [],
      addTask: false,
    })
    this.props.closeModal();
  }

  render() {
    const { showModal } = this.props;
    const { title, tasks, task, addTask, error } = this.state;

    return (
      <Modal
        isOpen={showModal}
        onRequestClose={() => this.closeModal()}
        contentLabel="New List"
      >
        <div style={{textAlign: 'center'}}>
          {error.length > 0 && <div style={{color: 'red'}}>{error}</div>}
          <h2>{title.length > 0 ? `${title}` : 'Title'}</h2>
          <label className="form-login">
            <div>
              <input type="text" name="title" placeholder="title" value={title} onChange={(e) => this.setTitle(e.target.value)} />
            </div>
          </label>
          <div>
            {tasks.map((value, i) => (
              <div className="addTask" key={i}>{`${i + 1}. ${value.task}`}</div>
            ))}
          </div>
          <div>
            <button className="newTaskButton" onClick={() => this.setState({ addTask: true })}>Add Task</button>
            {addTask && (
              <div>
                <label className="form-login">
                  <div>
                    <input type="text" name="task" placeholder="task" value={task} onChange={(e) => this.newTask(e.target.value)} />
                  </div>
                </label>
                <button className="saveTaskButton" onClick={() => this.saveTask()}>Save Task</button>
              </div>
            )}
          </div>
          <div className="newListActions">
            <button className="listActionCancel" onClick={() => this.closeModal()}>Cancel</button>
            <button className="listActionSave" onClick={() => this.saveList()}>Save</button>
          </div>
        </div>
      </Modal>
    );
  }
}
