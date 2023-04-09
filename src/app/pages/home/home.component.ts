//Title:  home.component.ts
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 14 March 2023
//Description:  TypeScript file for the home component.

import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from 'src/app/shared/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api/message';
import { Employee } from 'src/app/shared/models/employee.interface';
import { Item } from 'src/app/shared/models/item.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  serverMessages: Message[] = []
  employee: Employee
  todo: Item[]
  done: Item[]
  empId: number
  newTaskId: string
  newTaskMessage: string

  taskForm: FormGroup = this.fb.group({
    task: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35)])]
  })

  constructor(private taskService: TaskService, private cookieService: CookieService, private fb: FormBuilder,
    private dialog: MatDialog) { 
    this.empId = parseInt(this.cookieService.get('session_user'), 10)
    this.employee = {} as Employee
    this.todo = []
    this.done = []
    this.newTaskId = '' 
    this.newTaskMessage = ''  

    this.taskService.findAllTasks(this.empId).subscribe({
      
      next: (res) => {
        this.employee = res
        console.log('--Employee Data --')
        console.log(this.employee)

      },
      error: (err) => {
        console.error(err.message)
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message
          }
        ]
      },
      complete: () => {
        this.todo = this.employee.todo
        this.done = this.employee.done

        console.log('--ToDo and Done --')
        console.log(this.todo)
        console.log(this.done)
      }
    })
  }

  ngOnInit(): void {
  }

  createTask() {
    const newTask = this.taskForm.controls['task'].value

    this.taskService.createTasks(this.empId, newTask).subscribe({
      next: (res) => {
        this.newTaskId = res.data.id 
        this.newTaskMessage = res.message
        console.log('newTaskId:', this.newTaskId)
      },
      error: (err) => {
        console.error(err.message)
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message
          }
        ]

      },
      complete: () => {
        let task = {
          _id: this.newTaskId,
          text: newTask
        } as Item

        this.todo.push(task)

        this.newTaskId = ''

        this.taskForm.controls['task'].setErrors({'incorrect': false})

        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: this.newTaskMessage
          }
        ]        
      }
    })    
  }

  deleteTask(taskId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete Task Dialog',
        body: 'Are you sure you want to delete this task?'
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe ({
      next: (result) => {
        if (result === 'confirm') {
          this.taskService.deleteTask(this.empId, taskId).subscribe({
            next: (res) => {

              this.todo = this.todo.filter(task => task._id !== taskId)
              this.done = this.done.filter(task => task._id !== taskId)
              
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Task deleted successfully'
                }
              ]  
            },
            error: (err) => {
              this.serverMessages = [
                {
                  severity: 'error',
                  summary: 'Error',
                  detail: err.message
                }
              ]
            }
          })                 
        } else {
          this.serverMessages = [
            {
              severity: 'info',
              summary: 'Info',
              detail: 'Deletion cancelled'
            }            
          ]          
        }
      }
    })
  }

  updateTaskList(empId: number, todo: Item[], done: Item[]) {
    this.taskService.updateTask(empId, todo, done).subscribe({
      next: () => {       
          this.todo = todo
          this.done = done     
      },
      error: (err) => {
        this.serverMessages = [
          {
            severity: 'error',
            summary: 'Error',
            detail: err.message
          }
        ]
      }
    })
  }
  
  drop(event: CdkDragDrop<any []>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)

      console.log("Reordered tasks in the existing list")

      this.updateTaskList(this.empId, this.todo, this.done)
    } else {
      transferArrayItem(
        event.previousContainer.data, 
        event.container.data,
        event.previousIndex,
        event.currentIndex
        )
    }
  }
}