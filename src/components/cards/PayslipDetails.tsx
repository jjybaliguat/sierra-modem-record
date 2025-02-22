"use client"
import React, { useRef, useState } from 'react'
import { Button } from '../ui/button'
import { useReactToPrint } from 'react-to-print';
import { Payroll } from '@/types/payroll';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import html2canvas from "html2canvas";
import { PayslipStatus, SelectPayslipStatus } from '../select/SelectPayslipStatus';
import { updatePayslipStatus } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PayslipDetailsCard = ({
    payroll,
    user
}: {
    payroll: Payroll,
    user: User
}) => {
    const contentRef = useRef<HTMLDivElement>(null); 
    const reactToPrintFn = useReactToPrint({ contentRef, documentTitle: `Payslip-${payroll?.employee?.fullName}`});
    const [payslipStatus, setPayslipStatus] = useState(payroll.status)
    const [updating, setUpdating] = useState(false)
    const router = useRouter()


    const handleDownloadPNG = async () => {
        if (!contentRef.current) return;
    
        const canvas = await html2canvas(contentRef.current, {
          scale: 2, // Higher scale for better quality
          useCORS: true, // Prevents cross-origin issues
        });
    
        const image = canvas.toDataURL("image/png");
    
        // Create a link element for downloading
        const link = document.createElement("a");
        link.href = image;
        link.download = `payroll-${payroll.employee.fullName}`;
        link.click();
      };
      

      async function handleUpdatePayslipStatus(){
        setUpdating(true)
        try {
            const response: any = await updatePayslipStatus(payroll.id, payslipStatus)

            if(response.id){
                router.refresh()
                toast("Payslip Updated", {
                    description: `Payslip successfully updated`,
                    duration: 3000,
                })
            }else{
                toast("Error", {
                    description: `Something went wrong!`,
                    duration: 3000,
                })
            }
            setUpdating(false)
        } catch (error) {
            setUpdating(false)
            console.log(error)
            toast("Error", {
                description: `Something went wrong!`,
                duration: 3000,
            })
        }
      }

  return (
    <div className='mt-6 overflow-x-auto'>
        <div className='flex items-center gap-2 mb-4'>
            <Button onClick={()=>reactToPrintFn()} variant="outline">Print Payslip</Button>
            <Button onClick={handleDownloadPNG} variant="outline">Download</Button>
        </div>
        <div className='mb-4 flex items-center gap-2'>
            <h1>Payslip Status: </h1>
            <SelectPayslipStatus selected={payslipStatus} onSelectChange={setPayslipStatus} />
            <Button onClick={handleUpdatePayslipStatus} disabled={updating}>{updating? "Updating..." : "Update"}</Button>
        </div>
        <div ref={contentRef} className="w-[950px] p-6 rounded-lg border-2 border-dashed border-gray-500 shadow-md print-top-left bg-white text-black">
        <div className='flex justify-between'>
            <h1 className='text-2xl md:text-2xl font-semibold'>{user.company.name}</h1>
            <div className="flex gap-2 items-centerfont-semibol text-lg">
                <span>Status: </span>
                <span className={cn({
                    'font-semibold': true,
                    'text-green-600': payroll.status === PayslipStatus.PAID,
                    'text-yellow-600' : payroll.status === PayslipStatus.PENDING,
                    'text-red-500' : payroll.status === PayslipStatus.CANCELED
                })}>{payroll.status}</span>
            </div>
        </div>
        <div className='flex justify-between w-full'>
            <h4 className="text-[14px] font-semibold mb-4">Employee Payslip</h4>
            <h4 className="text-[14px] font-semibold mb-4">Period: {formatDate(payroll?.periodStart)} to {formatDate(payroll?.periodEnd)}</h4>
        </div>
        {/* Employee Information */}
        <div className="mb-4">
            <p><span className="text-[14px] font-semibold">Name:</span> {payroll?.employee?.fullName}</p>
            <p><span className="text-[14px] font-semibold">Position:</span> {payroll?.employee?.position}</p>
            <p><span className="text-[14px] font-semibold">Department:</span> {payroll?.employee?.department || "NA"}</p>
        </div>
        <div className='border-t py-4 border-gray-300 flex gap-8'>
            {/* Work Hours Breakdown */}
            <div className="">
            <h3 className="text-[14px] text-lg font-semibold mb-2">Hours Worked</h3>
            <div className="text-[14px] flex items-center gap-2">
                <span>Regular Hours: </span>
                <span> {payroll?.regularHours}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>Overtime Hours: </span>
                <span> {payroll?.overtimeHours}</span>
            </div>
            </div>
            {/* Salary Breakdown */}
            <div className="">
            <h3 className="text-lg font-semibold mb-2">Earnings</h3>
            <div className="text-[14px] flex items-center gap-2">
                <span>Basic Salary:</span>
                <span>{formatCurrency(payroll?.basicSalary)}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>Overtime Pay:</span>
                <span>{formatCurrency(payroll?.overtimePay)}</span>
            </div>
            </div>
            {/* Adjustments */}
            <div className="">
            <h3 className="text-xl font-semibold mb-2">Adjustments</h3>
            <div className="text-[14px] flex items-center gap-2">
                <span>Incentive:</span>
                <span>{formatCurrency(payroll?.incentive)}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>Paid Leaves:</span>
                <span>{formatCurrency(payroll?.paidLeaves)}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>Holiday Pay:</span>
                <span>{formatCurrency(payroll?.holidayPay)}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>Others:</span>
                <span>{formatCurrency(payroll?.otherPay)}</span>
            </div>
            </div>
        </div>
        {/* Deductions Breakdown */}
        <div className="border-t border-gray-300 pt-4 flex justify-between">
            <div>
            <h3 className="text-lg font-semibold mb-2 text-red-500">Deductions</h3>
            <div className="text-[14px] flex items-center gap-2">
                <span>SSS:</span>
                <span>{formatCurrency(payroll?.sssDeduction)}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>PhilHealth:</span>
                <span>{formatCurrency(payroll?.philHealthDeduction)}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>Pag-IBIG:</span>
                <span>{formatCurrency(payroll?.pagIbigDeduction)}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>Tax:</span>
                <span>{formatCurrency(payroll?.taxDeduction)}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>CashAdvance:</span>
                <span>{formatCurrency(payroll?.caDeduction)}</span>
            </div>
            <div className="text-[14px] flex items-center gap-2">
                <span>Other Deductions:</span>
                <span>{formatCurrency(payroll?.otherDeduction)}</span>
            </div>
            </div>
            <div className='flex justify-end'>
                <div className='flex flex-col gap-2 '>
                {/* Total Deduction */}
                <div className="text-[14px] border-t border-gray-300 mt-3 pt-3 flex justify-between font-semibold text-red-600">
                <span>Total Deductions: </span>
                <span>{formatCurrency(payroll?.totalDeduction)}</span>
                </div>
                {/* Gross Salary */}
                <div className="text-[14px] border-t border-gray-300 mt-3 pt-2 flex justify-between font-semibold">
                    <span>Gross Pay:</span>
                    <span>{formatCurrency(payroll?.grossPay)}</span>
                </div>
                {/* Net Salary */}
                <div className="border-t border-gray-300 pt-2 flex justify-between font-semibol text-lg">
                    <span>Net Pay: </span>
                    <span className='text-green-600'> {formatCurrency(payroll?.netPay)}</span>
                </div>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default PayslipDetailsCard