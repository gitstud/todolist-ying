import React, { Component } from 'react';

import ListModal from './ListModal';
import TaskList from './TaskList';
import Trash from './Trash';
import { ref, firebaseAuth } from '../config/firebase';

require('../index.css');

export default class Dashboard extends Component {

  state={
    showModal: false,
    task: '',
    title: '',
    tasks: [],
    addTask: false,
    error: '',
    taskLists: [],
    trashList: [],
  }

  componentDidMount() {
    //get lists from firebase
    const user = firebaseAuth().currentUser;
    const database = ref.child(`users/${user.uid}/lists`);
    // listen for realtime changes and update state
    database.on('value', snap => {
      if (!snap.exists()) {
        return;
      }
      const res = snap.val();
      const keys = Object.keys(res);
      const taskLists = [];
      const trashList = [];
      // grab object keys and create new list of objects
      keys.map(key => {
        let myTask = res[key];
        // save key for future reference
        myTask.key = key;
        if (!myTask.tasks) {
          myTask.tasks = [];
        }
        const len = myTask.tasks.length;
        for (let i = 0; i < len; i++) {
          myTask.tasks[i].pk = i;
          myTask.tasks[i].key = key;
          myTask.tasks[i].list = myTask.title;
          if (myTask.tasks[i].deleted === true) {
            trashList.push(myTask.tasks[i]);
          }
        }
        return taskLists.push(myTask);
      });
      this.setState({ taskLists, trashList });
    });
  }

  closeModal() {
    this.setState({ showModal: false, title: '', tasks: [] });
  }

  render() {
    const { showModal, taskLists, trashList } = this.state;
    return (
      <div>
        <div style={{textAlign: 'center'}}>To edit a task or list title, just click on the task's text.</div>
        <button className="newListButton" onClick={() => this.setState({showModal: true})}>Create New List</button>
        <ListModal showModal={showModal} closeModal={() => this.closeModal()} />
        <div className="myLists">
          {taskLists.map((value, i) => (
            <TaskList key={i} taskList={value} />
          ))}
        </div>
        <Trash trash={trashList} />
      </div>
    )
  }
}
