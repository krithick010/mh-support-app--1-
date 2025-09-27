"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell } from "recharts"

const chartConfig = {
  views: {
    label: "Page Views",
  },
  "chrome": {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  "safari": {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  "firefox": {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  "edge": {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  "other": {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

const studentStatusData = [
  { status: "Active", value: 60, fill: "var(--color-chrome)" },
  { status: "Under Review", value: 20, fill: "var(--color-safari)" },
  { status: "Inactive", value: 10, fill: "var(--color-firefox)" },
  { status: "Urgent", value: 10, fill: "var(--color-edge)" },
]

const urgentCasesData = [
  { day: "Mon", cases: 2 },
  { day: "Tue", cases: 3 },
  { day: "Wed", cases: 4 },
  { day: "Thu", cases: 2 },
  { day: "Fri", cases: 1 },
]

const sessionTypesData = [
    { type: "Individual", count: 80 },
    { type: "Group", count: 30 },
    { type: "Emergency", count: 14 },
]

const wellnessMetricsData = [
    { month: "Jan", value: 51 },
    { month: "Feb", value: 62 },
    { month: "Mar", value: 78 },
    { month: "Apr", value: 70 },
    { month: "May", value: 85 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Counsellor Analytics</h1>
          <p className="text-muted-foreground">
            Track student wellness trends and intervention effectiveness
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Filter Data</Button>
          <Button>Export Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">78%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">2</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={studentStatusData} dataKey="value" nameKey="status" innerRadius={50}>
                    {studentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Urgent Cases - Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <LineChart data={urgentCasesData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="cases" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Session Types - Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart data={sessionTypesData} layout="vertical">
                        <CartesianGrid horizontal={false} />
                        <YAxis dataKey="type" type="category" />
                        <XAxis type="number" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Average Wellness Metrics (Monthly)</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <LineChart data={wellnessMetricsData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
