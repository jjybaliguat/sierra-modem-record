import { Employees } from "./employees";

export interface CashAdvance {
    id: string,
    employeeId: string,
    employee: Employees,
    amount: number,
    updatedAt: string,
    createdAt: string
}