"use client"

import React from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const data = [
  { count: 0, month: "JAN" },
  { count: 0, month: "FEB" },
  { count: 0, month: "MAR" },
  { count: 11, month: "APR" },
  { count: 29, month: "MAY" },
  { count: 2, month: "JUN" },
  { count: 1, month: "JUL" },
  { count: 1, month: "AUG" },
  { count: 0, month: "SEP" },
  { count: 0, month: "OCT" },
  { count: 0, month: "NOV" },
  { count: 0, month: "DEC" }
]

export default function MemberJoinChart() {
  if (!data || data.length === 0) {
    return <div>No data available</div>
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Member Joins by Month (2024)</CardTitle>
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
  )
}