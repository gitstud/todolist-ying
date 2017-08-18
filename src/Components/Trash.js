import React, { Component } from 'react';
import { ref, firebaseAuth } from '../config/firebase';

export default class Trash extends Component {

  state={
    trashList: this.props.trash,
  }

  restoreTask(task) {
    const { deleted, pk, key } = task;
    const user = firebaseAuth().currentUser;
    ref.child(`users/${user.uid}/lists/${key}/tasks/${pk}`).update({deleted: !deleted});
  }

  deleteTask(task) {
    const { pk, key } = task;
    const user = firebaseAuth().currentUser;
    ref.child(`users/${user.uid}/lists/${key}/tasks/`).once('value').then(snap => {
      if (snap.exists()) {
        let remainingTasks = snap.val();
        remainingTasks.splice(pk, 1);
        ref.child(`users/${user.uid}/lists/${key}/`).update({tasks: remainingTasks});
      }
    });
  }

  render() {
    const trashList = this.props.trash;
    return (
      <div>
        <div
          style={{
            margin: '30px auto 15px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: '900',
            textDecoration: 'underline',
          }}
        >Trash</div>
        <div>
          <table>
            <thead>
              <tr>
                <th>List</th>
                <th>Task</th>
                <th>Restore</th>
                <th>Delete Forever</th>
              </tr>
            </thead>
            <tbody>
              {trashList.map((value, i) => (
                <tr key={i}>
                  <td>{value.list}</td>
                  <td>{value.task}</td>
                  <td>
                    <button onClick={() => this.restoreTask(value)}>Restore</button>
                  </td>
                  <td>
                    <button onClick={() => this.deleteTask(value)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
