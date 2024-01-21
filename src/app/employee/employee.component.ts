import { Component, Input, OnInit } from '@angular/core';

import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  @Input() employee: Employee;
  totalReports: number;
  directReports: Array<Employee>;
  isLoading: boolean;

  constructor(private employeeService: EmployeeService) {
    this.totalReports = 0;
    this.directReports = [];
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.getReports(this.employee, true).then(() => {
      this.isLoading = false;
    });
  }

  async getReports(employee: Employee, isDirect: boolean): Promise<void> {
    if (employee.directReports) {
      for (const employeeId of employee.directReports) {
        const e = await this.employeeService.get(employeeId).toPromise();
        if (isDirect) {
          this.directReports.push(e);
        }
        if (e.directReports && e.directReports.length > 0) {
          await this.getReports(e, false);
        }
        this.totalReports++;
      }
    }
  }
}
