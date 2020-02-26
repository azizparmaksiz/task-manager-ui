import {Component, OnDestroy, OnInit} from '@angular/core';

import * as SockJS from 'sockjs-client';
import {TaskService} from '../../service/task.service';
import {environment} from '../../../environments/environment';

import {Subject} from 'rxjs/index';
import {debounceTime, switchMap} from 'rxjs/operators';

@Component({
  selector: 'task-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})

export class ListTaskComponent implements OnInit, OnDestroy {

  private sock: SockJS;
  private opened = false;

  constructor(private taskSvc: TaskService) {

    this.initializa();
  }

  taskList = [];

  columns = [
    {field: 'id', header: 'Task Id'},
    {field: 'title', header: 'Title'},
    {field: 'description', header: 'Description'},
    {field: 'createdAt', header: 'Create Date'},
    {field: 'dueDate', header: 'Due Date'},
    {field: 'status', header: 'Status'},
    {field: 'priority', header: 'Priority'},
  ];

  private searchTerms = new Subject<any>();

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.taskSvc.getTasks())).subscribe(
      result => {
        this.taskList = [...result];
      },
      error => {
        this.taskList = [];
      }
    );
    this.loadData();
  }

  loadData() {
    this.taskList = [];
    this.searchTerms.next(null);
  }

  deleteTask(taskId, index) {
    this.taskSvc.deleteTask(taskId).then(result => {
      this.taskList.splice(index, 1);
    });
  }

  initializa() {
    const me = this;
    if (!this.opened) {
      this.sock = new SockJS(environment.host + 'websocket/new-task');
      this.sock.onopen = (e) => {
        console.log('ws opened');
      };

      this.sock.onmessage = (e) => {
        console.log('message- received');
        if ((typeof (e.data) !== 'undefined') && (e.data !== null)) {
          const dataItem = JSON.parse(e.data);
          me.taskList.push(dataItem);

        }
      };

      this.sock.onclose = (e) => {
        this.sock.close();
      };

      this.sock.onerror = (e) => {
        console.log(JSON.stringify(e));
      };

      this.opened = true;
    }

  }


  public close(): void {
    if (this.opened) {
      this.sock.close();
      delete this.sock;
      this.opened = false;
    }
  }

  ngOnDestroy() {
    this.close();
  }


}
