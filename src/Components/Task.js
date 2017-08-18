import React, { Component } from 'react';
import { ref, firebaseAuth } from '../config/firebase';

export default class Task extends Component {

  state={
    newTask: '',
    editing: false,
  }

  editTask() {
    this.setState({ newTask: this.props.task.task, editing: true });
  }

  updateTask() {
    const task = this.state.newTask;
    if (task.length < 1) {
      this.setState({ newTask: '', editing: false });
      return;
    }
    const { pk } = this.props.task;
    const key = this.props.list;
    const user = firebaseAuth().currentUser;
    const taskRef = ref.child(`users/${user.uid}/lists/${key}/tasks/${pk}`).update({ task });
    taskRef.then((res) => {
      this.props.reloadTask();
    });
    this.setState({ newTask: '', editing: false });
  }

  markTask() {
    const { completed, pk } = this.props.task;
    const key = this.props.list;
    const user = firebaseAuth().currentUser;
    const taskRef = ref.child(`users/${user.uid}/lists/${key}/tasks/${pk}`).update({completed: !completed});
    taskRef.then((res) => {
      this.props.reloadTask();
    });
  }

  deleteTask() {
    const { deleted, pk } = this.props.task;
    const key = this.props.list;
    const user = firebaseAuth().currentUser;
    const taskRef = ref.child(`users/${user.uid}/lists/${key}/tasks/${pk}`).update({deleted: !deleted});
    taskRef.then((res) => {
      this.props.reloadTask();
    });
  }

  render() {
    const { task, completed, deleted } = this.props.task;
    const { editing, newTask } = this.state;

    if (deleted) {
      return null;
    }

    return (
      <div className="list-item">
        {!editing && (
          <div>
            <div
              className="list-text"
              style={completed ? {textDecoration: 'line-through'} : {}}
              onClick={() => this.editTask()}
            >
              {task}
            </div>
            <button className="task-mark" onClick={() => this.markTask()}>{completed ? 'Not Done' : 'Done'}</button>
            <button className="task-delete" onClick={() => this.deleteTask()}>Delete</button>
          </div>
        )}

        {editing && (
          <div>
            <input type="text" name="task" placeholder="task" value={newTask} onChange={(e) => this.setState({ newTask: e.target.value })} />
            <button className="task-delete" onClick={() => this.updateTask()}>Update</button>
          </div>
        )}

      </div>
    );
  }
}
