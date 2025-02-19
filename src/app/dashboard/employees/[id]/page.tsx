import React from 'react'
import UpdateEmployeeForm from '@/components/forms/UpdateEmployee'
import { getSingleEmployee } from '@/app/actions'

const EmployeeDetail = async({
    params
} : {
    params: Promise<{id: string}>
}) => {
    const id = (await params).id
    const employee: any = await getSingleEmployee(id)
  return (
    <UpdateEmployeeForm employee={employee} />
  )
}

export default EmployeeDetail