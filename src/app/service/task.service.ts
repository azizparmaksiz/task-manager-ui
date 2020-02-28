import {Injectable} from '@angular/core';
import {BaseHttpService} from './base-service';
import {OptionService} from './option-service';

@Injectable()
export class TaskService {

  constructor(private baseHttpService: BaseHttpService, private optionSvc: OptionService) {
  }

  getTasks() {
    return this.baseHttpService.getObservable('task/all', this.optionSvc.getHeader());
  }

  deleteTask(taskId: any) {
    return this.baseHttpService.delete('task/delete/' + taskId);
  }

  updateTask(tempEditObj: any) {
    return this.baseHttpService.post('task/update', tempEditObj, this.optionSvc.getHeader());
  }

  postponeTask(tempEditObj: any) {
    return this.baseHttpService.post('task/postpone', tempEditObj, this.optionSvc.getHeader());
  }
}
