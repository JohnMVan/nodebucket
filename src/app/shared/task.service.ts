//Title:  task.service.ts
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 14 March 2023
//Description:  TypeScript file for the task.service component.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Item } from '../shared/models/item.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  findAllTasks(empId: number): Observable<any> {
    return this.http.get(`/api/employees/${empId}/tasks`)
  }

  createTasks(empId: number, task: string): Observable<any> {
    return this.http.post(`/api/employees/${empId}/tasks`, {
      text: task
    })
  }

  updateTask(empId: number, todo: Item[], done: Item[]): Observable<any> {
    return this.http.put(`/api/employees/${empId}/tasks`, {
      todo,
      done
    })
  }
  
  deleteTask(empId: number, taskId: string): Observable<any> {
    return this.http.delete(`/api/employees/${empId}/tasks/${taskId}`)
  }
}
