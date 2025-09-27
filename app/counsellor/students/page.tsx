"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Activity, AlertTriangle, Archive } from "lucide-react"

const students = [
  {
    id: "anon-12345",
    status: "Active",
    risk: "Low",
    sessions: 5,
    lastActive: "2 hours ago",
  },
  {
    id: "anon-67890",
    status: "Under Review",
    risk: "Medium",
    sessions: 12,
    lastActive: "1 day ago",
  },
  {
    id: "anon-45123",
    status: "Urgent",
    risk: "High",
    sessions: 8,
    lastActive: "30 minutes ago",
  },
  {
    id: "anon-78901",
    status: "Active",
    risk: "Low",
    sessions: 3,
    lastActive: "3 hours ago",
  },
  {
    id: "anon-34567",
    status: "Inactive",
    risk: "Low",
    sessions: 15,
    lastActive: "1 week ago",
  },
  {
    id: "anon-89012",
    status: "Under Review",
    risk: "Medium",
    sessions: 7,
    lastActive: "6 hours ago",
  },
]

const riskColor: { [key: string]: "default" | "secondary" | "destructive" } = {
  Low: "secondary",
  Medium: "default",
  High: "destructive",
}

export default function StudentManagementPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Student Wellness Management</h1>
          <p className="text-muted-foreground">
            Monitor and support student mental health & wellbeing
          </p>
        </div>
        <Button>Add New Student</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <div className="flex items-center space-x-4 pt-2">
            <Input placeholder="Search students..." className="max-w-sm" />
            <Button variant="outline">Filter</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anonymous ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "Urgent" ? "destructive" : "outline"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={riskColor[student.risk]}>
                      {student.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.sessions}</TableCell>
                  <TableCell>{student.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
