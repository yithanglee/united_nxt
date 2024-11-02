"use client"

import React, { useState, useEffect } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import LoanHistoryChart from '@/components/charts/loan-history'

interface MemberJoinData {
    count: number
    month: string
}

export default function StatisticsPage() {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

    const [selectedYear, setSelectedYear] = useState(currentYear.toString())
    const [data, setData] = useState<MemberJoinData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/svt_api/webhook?scope=statistic&title=member_join_by_month&year=${selectedYear}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch data')
                }
                const result = await response.json()
                setData(result)
            } catch (err) {
                setError('An error occurred while fetching data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [selectedYear])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Library Statistics</h1>
            <div className="mb-4">
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
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">Loading...</div>
            ) : error ? (
                <div className="flex justify-center items-center h-64 text-red-500">{error}</div>
            ) : (
                <MemberJoinChart data={data} year={selectedYear} />
            )}
        </div>
    )
}

function MemberJoinChart({ data, year }: { data: MemberJoinData[], year: string }) {
    if (!data || data.length === 0) {
        return <div>No data available for {year}</div>
    }

    return (
        <div>
            <div className='mb-8'>
                <Card className="w-full max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>Member Joins by Month ({year})</CardTitle>
                        <CardDescription>Number of new members joining each month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                count: {
                                    label: "New Members",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis
                                        dataKey="month"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="var(--color-count)"
                                        radius={[4, 4, 0, 0]}
                                        barSize={30}
                                    />
                                    <ChartTooltip />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            <div>
                <LoanHistoryChart />

            </div>
        </div>

    )
}