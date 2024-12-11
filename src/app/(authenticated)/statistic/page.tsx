"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import LoanHistoryChart from '@/components/charts/loan-history'
import MemberJoinChart from '@/components/charts/member-barchart'
import { BookOpen, Users, Download } from 'lucide-react'

interface LoanData {
    count: number
    month: string
}

interface CategoryLoanData {
    category: string
    code: string
    data: LoanData[]
}

interface MemberJoinData {
    count: number
    month: string
}

interface NewBookData {
    count: number
    month: string
}

interface StatData {
    currentYearTotal: number
    previousYearTotal: number
    percentageChange: number
}

export default function StatisticsPage() {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
    const [selectedYear, setSelectedYear] = useState(currentYear.toString())
    const [memberJoinData, setMemberJoinData] = useState<MemberJoinData[]>([])
    const [newBookData, setNewBookData] = useState<NewBookData[]>([])
    const [loanData, setLoanData] = useState<LoanData[]>([])
    const [categoryLoanData, setCategoryLoanData] = useState<CategoryLoanData[]>([])
    const [memberStats, setMemberStats] = useState<StatData>({ currentYearTotal: 0, previousYearTotal: 0, percentageChange: 0 })
    const [loanStats, setLoanStats] = useState<StatData>({ currentYearTotal: 0, previousYearTotal: 0, percentageChange: 0 })
    const [newBookStats, setNewBookStats] = useState<StatData>({ currentYearTotal: 0, previousYearTotal: 0, percentageChange: 0 })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const [memberJoinResponse, memberJoinPreviousResponse, 
                    
                    
                    newBookResponse,
                    newBookPreviousResponse,
                    
                    
                    loanResponse, loanPreviousResponse, categoryResponse] = await Promise.all([
                    fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook?scope=statistic&title=member_join_by_month&year=${selectedYear}`),
                    fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook?scope=statistic&title=member_join_by_month&year=${parseInt(selectedYear) - 1}`),

                    fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook?scope=statistic&title=new_books_by_month&year=${selectedYear}`),
                    fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook?scope=statistic&title=new_books_by_month&year=${parseInt(selectedYear) - 1}`),


                    fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook?scope=statistic&title=loan_history_by_month&year=${selectedYear}`),
                    fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook?scope=statistic&title=loan_history_by_month&year=${parseInt(selectedYear) - 1}`),
                    fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook?scope=statistic&title=loan_history_by_category_month&year=${selectedYear}`)
                ])

                if (!memberJoinResponse.ok || !memberJoinPreviousResponse.ok || !loanResponse.ok || !loanPreviousResponse.ok || !categoryResponse.ok || !newBookResponse.ok || !newBookPreviousResponse.ok) {
                    throw new Error('Failed to fetch data')
                }

                const memberJoinData = await memberJoinResponse.json()
                const memberJoinPreviousData = await memberJoinPreviousResponse.json()

                const newBookData = await newBookResponse.json()
                const newBookPreviousData = await newBookPreviousResponse.json()

                const loanData = await loanResponse.json()
                const loanPreviousData = await loanPreviousResponse.json()
                const categoryData = await categoryResponse.json()

                setMemberJoinData(memberJoinData)


                setNewBookData(newBookData)

                setLoanData(loanData)
                setCategoryLoanData(categoryData)

                // Calculate member stats
                const currentYearMemberTotal = memberJoinData.reduce((sum: any, item: { count: any }) => sum + item.count, 0)
                const previousYearMemberTotal = memberJoinPreviousData.reduce((sum: any, item: { count: any }) => sum + item.count, 0)
                const memberPercentageChange = previousYearMemberTotal !== 0
                    ? ((currentYearMemberTotal - previousYearMemberTotal) / previousYearMemberTotal) * 100
                    : 0

                setMemberStats({
                    currentYearTotal: currentYearMemberTotal,
                    previousYearTotal: previousYearMemberTotal,
                    percentageChange: memberPercentageChange
                })


                // calculate new book stats
                const currentYearNewBookTotal = newBookData.reduce((sum: any, item: { count: any }) => sum + item.count, 0)
                const previousYearNewBookTotal = newBookPreviousData.reduce((sum: any, item: { count: any }) => sum + item.count, 0)
                const newBookPercentageChange = previousYearNewBookTotal !== 0
                    ? ((currentYearNewBookTotal - previousYearNewBookTotal) / previousYearNewBookTotal) * 100
                    : 0

                setNewBookStats({
                    currentYearTotal: currentYearNewBookTotal,
                    previousYearTotal: previousYearNewBookTotal,
                    percentageChange: newBookPercentageChange
                })



                // Calculate loan stats
                const currentYearLoanTotal = loanData.reduce((sum: any, item: { count: any }) => sum + item.count, 0)
                const previousYearLoanTotal = loanPreviousData.reduce((sum: any, item: { count: any }) => sum + item.count, 0)
                const loanPercentageChange = previousYearLoanTotal !== 0
                    ? ((currentYearLoanTotal - previousYearLoanTotal) / previousYearLoanTotal) * 100
                    : 0

                setLoanStats({
                    currentYearTotal: currentYearLoanTotal,
                    previousYearTotal: previousYearLoanTotal,
                    percentageChange: loanPercentageChange
                })

            } catch (err) {
                setError('An error occurred while fetching data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [selectedYear])

    const handleDownload = (type: 'member_month' | 'category_month') => {
        window.open(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/admin/csv?type=${type}`, '_blank')
    }

    return (
        <div className="container mx-auto lg:p-4">
            <h1 className="text-2xl font-bold mb-6">Library Statistics</h1>
            <div className="mb-4 flex justify-between items-center">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="gap-2 flex flex-col lg:flex-row">
                    <Button onClick={() => handleDownload('member_month')} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Member Data
                    </Button>
                    <Button onClick={() => handleDownload('category_month')} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Category Data
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">Loading...</div>
            ) : error ? (
                <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
            ) : (
                <>
                    <div className='flex flex-col gap-4'>
                        <div className='flex gap-4'>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{memberStats.currentYearTotal}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {memberStats.percentageChange >= 0 ? '+' : ''}
                                        {memberStats.percentageChange.toFixed(1)}% from last year
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{loanStats.currentYearTotal}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {loanStats.percentageChange >= 0 ? '+' : ''}
                                        {loanStats.percentageChange.toFixed(1)}% from last year
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total New Books</CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{newBookStats.currentYearTotal}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {newBookStats.percentageChange >= 0 ? '+' : ''}
                                        {newBookStats.percentageChange.toFixed(1)}% from last year
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className='grid grid-cols-12 gap-4'>
                            <MemberJoinChart
                                title={'Member Joins by Month'}
                                subtitle={'Number of new members joining each month'}
                                data={memberJoinData}
                                year={selectedYear}
                            />
                            <MemberJoinChart
                                title={'Loans by Month'}
                                subtitle={'Number of new loans each month'}
                                data={loanData}
                                year={selectedYear}
                            />
                            <MemberJoinChart
                                title={'New Books by Month'}
                                subtitle={'Number of new books each month'}
                                data={newBookData}
                                year={selectedYear}
                            />
                        </div>
                        <LoanHistoryChart
                            subtitle={'Number of loans per category each month'}
                            title={'Loan History by Category'}
                            data={categoryLoanData}
                            year={selectedYear}
                        />
                    </div>
                </>
            )}
        </div>
    )
}