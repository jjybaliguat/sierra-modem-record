import { PayslipStatus } from "@/components/select/SelectPayslipStatus";
import { Employees } from "./employees";

export interface Payroll {
    id: string,
    employeeId: string,
    employee: Employees,
    regularHours: number,
    overtimeHours:  number,
    basicSalary:    number,
    overtimePay:    number,
    incentive:      number,
    paidLeaves:     number,
    holidayPay:     number,
    foodAllowance:     number,
    otherPay:       number,
    sssDeduction: number,  
    philHealthDeduction: number, 
    pagIbigDeduction: number,  
    taxDeduction: number,  
    caDeduction: number, 
    otherDeduction: number,  
    totalDeduction: number, 
    grossPay: number,  
    netPay: number,  
    periodStart: string,
    periodEnd: string, 
    status: PayslipStatus,  
}