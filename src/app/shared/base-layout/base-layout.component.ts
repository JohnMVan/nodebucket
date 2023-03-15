//Title:  base-layout.component.ts
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 14 March 2023
//Description:  TypeScript file for the base-layout component.

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {

  year: number = Date.now();

  constructor() { }

  ngOnInit(): void {
  }
}
