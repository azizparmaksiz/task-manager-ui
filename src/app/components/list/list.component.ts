import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import * as SockJS from 'sockjs-client';
import {TaskService} from '../../service/task.service';
import {environment} from '../../../environments/environment';

import {Subject} from 'rxjs/index';
import {debounceTime, switchMap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'task-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})

export class ListTaskComponent implements OnInit, OnDestroy {
  @ViewChild('closebutton') closebutton;
  private sock: SockJS;
  private opened = false;

  constructor(private taskSvc: TaskService, private toastrSvc: ToastrService) {

    this.initialize();
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

  selectedTask;

  modal = {
    mode: '',
    object: null
  };

  openEditModal(item, mode) {
    this.selectedTask = item;
    this.modal.object = Object.assign({}, item);
    this.modal.mode = mode;
  }

  update() {

    this.taskSvc.updateTask(this.modal.object).then(result => {
      this.selectedTask.description = this.modal.object.description;
      this.selectedTask.status = this.modal.object.status;
      this.closebutton.nativeElement.click();
      this.toastrSvc.success('Task id=' + this.selectedTask.id + ' updated', '');
    }).catch(error => {
      this.toastrSvc.error(error.errorCode);
    });
  }


  postpone() {

    this.taskSvc.postponeTask(this.modal.object).then(result => {
      this.selectedTask.dueDate = this.modal.object.dueDate;
      this.closebutton.nativeElement.click();
      this.toastrSvc.success('Task id=' + this.selectedTask.id + ' postponed', '');
    }).catch(error => {
      this.toastrSvc.error(error.errorCode);
    });
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.taskSvc.getTasks())).subscribe(
      result => {
        // when date format different, date component may not parse json date to date properly
        if (result && result.length) {
          result.forEach(rs => {
            rs.dueDate = new Date(rs.dueDate);
          });
        }
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
      this.toastrSvc.success('Task id=' + taskId + ' deleted', '');
    }).catch(error => {
      this.toastrSvc.error(error.errorCode);
    });
  }

  // websocket connection initialize
  private initialize() {
    const me = this;
    if (!this.opened) {
      this.sock = new SockJS(environment.host + 'websocket/new-task');
      this.sock.onopen = (e) => {
        console.log('ws opened');
      };

      this.sock.onmessage = (e) => {
        if ((typeof (e.data) !== 'undefined') && (e.data !== null)) {
          const dataItem = JSON.parse(e.data);
          if (dataItem) {
            dataItem.dueDate = new Date(dataItem.dueDate);
            me.taskList.push(dataItem);
            me.toastrSvc.info('new task received,  task id=' + dataItem.id);
          }
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
