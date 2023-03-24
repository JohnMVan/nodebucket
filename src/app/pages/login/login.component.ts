//Title:  login.component.ts
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 22 March 2023
//Description:  TypeScript file for the login component.

import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/shared/session.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Message } from 'primeng/api';
import { Employee } from 'src/app/shared/models/employee.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessages: Message[] = [];
  employee: Employee;

  loginForm: FormGroup = this.fb.group({
    empId: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])]

  })

  constructor(private fb: FormBuilder, private router: Router, private cookieService: CookieService, private sessionService: SessionService) {
    this.employee = {} as Employee
   }

  ngOnInit(): void {
  }

  login() {
    const empId = this.loginForm.controls['empId'].value
    
    this.sessionService.findEmployeeById(empId).subscribe({

      next: (res: any) => {
        if (res) {
          this.employee = res;
          this.cookieService.set('session_user', this.employee.empId.toString(), 1)
          this.cookieService.set('session_name', `${this.employee.firstName} ${this.employee.lastName}`, 1)
          this.router.navigate(['/'])
        } else {
          this.errorMessages = [
            {severity: 'error', summary: 'Error', detail: 'Please enter a valid empId to continue.'}
          ]
        }
      },
      error: (err: any) => {
        console.error(err)
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: err.message }
        ]
      }
    })
  }
}
