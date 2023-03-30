//Title:  employee.interface.ts
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 22 March 2023
//Description:  TypeScript file for the employee interface.

import { Item } from "./item.interface";

export interface Employee {
    empId: number;
    firstName: string;
    lastName: string;
    todo: Item[];
    done: Item[];
}


