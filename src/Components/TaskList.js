import React, { Component } from 'react';

import Task from './Task';
import { ref, firebaseAuth } from '../config/firebase';

export default class TaskList extends Component {

  state={
    task: '',
    addTask: false,
    visibleTasks: this.props.taskList.tasks,
    filter: 'all',
  }

  updateTitle() {
    const user = firebaseAuth().currentUser;
    const { newTitle, editing } = this.state;
    const { key } = this.props.taskList;
    ref.child(`users/${user.uid}/lists/${key}`).update({ title: newTitle });
    this.setState({ newTitle: '', editing: !editing });
  }

  saveTask() {
    const { task } = this.state;
    if (task.length < 1) {
      this.setState({addTask: false});
      return;
    }
    const user = firebaseAuth().currentUser;
    const { key, tasks } = this.props.taskList;
    let newTasks = [...tasks];
    newTasks.push({task: task, completed: false, deleted: false});
    const taskRef = ref.child(`users/${user.uid}/lists/${key}`).update({tasks: newTasks});
    taskRef.then(res => (
      this.filterTasks(this.state.filter)
    ))
    this.setState({ task: '', addTask: false });
  }

  shareList() {
    console.log('share list here');
  }

  filterTasks(filter) {
    const tasks = this.props.taskList.tasks;
    let visibleTasks;
    switch(filter) {
      case 'completed':
        visibleTasks = tasks.filter(value => (
          value.completed === true
        ));
        this.setState({ visibleTasks, filter });
        break;

      case 'incompleted':
        visibleTasks = tasks.filter(value => (
          value.completed === false
        ));
        this.setState({ visibleTasks, filter });
        break;

      case 'all':
        this.setState({ visibleTasks: tasks, filter });
        break;

      default:
        return;
    }
  }

  reloadTask() {
    this.filterTasks(this.state.filter);
  }

  render() {
    const { title, key } = this.props.taskList;
    const { addTask, task, visibleTasks, filter, editing, newTitle } = this.state;

    return (
      <div className="list">
        {!editing && <div className="list-title" onClick={() => this.setState({ editing: true, newTitle: title})}>{title}</div>}
        {editing && (
          <div style={{padding: '15px 0px'}}>
            <input value={newTitle} name="newTitle" onChange={(e) => this.setState({ newTitle: e.target.value})} />
            <button className="task-delete" onClick={() => this.updateTitle()}>Update Title</button>
          </div>
        )}
        <div style={{padding: '15px 0px'}}>
          <button className={filter === 'all' ? 'filter-active' : 'filter'} onClick={() => this.filterTasks('all')}>All</button>
          <button className={filter === 'completed' ? 'filter-active' : 'filter'} onClick={() => this.filterTasks('completed')}>Completed</button>
          <button className={filter === 'incompleted' ? 'filter-active' : 'filter'} onClick={() => this.filterTasks('incompleted')}>Incompleted</button>
        </div>
        {visibleTasks.map((value, i) => (
          <Task task={value} item={i} list={key} key={i} reloadTask={() => this.reloadTask()} />
        ))}
        <button className="newTaskButton" onClick={() => this.setState({ addTask: true })}>Add Task</button>
        {addTask && (
          <div>
            <label className="form-login">
              <div>
                <input type="text" name="task" placeholder="task" value={task} onChange={(e) => this.setState({task: e.target.value})} />
              </div>
            </label>
            <button className="saveTaskButton" onClick={() => this.saveTask()}>Save Task</button>
          </div>
        )}
        <div style={{padding: '15px 0px'}}>
          <button className="shareButton" onClick={() => this.shareList()}>Share List</button>
        </div>
      </div>
    );
  }
}
