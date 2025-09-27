"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

const rows = [
  { date: "2025-09-20", student: "Asha R.", type: "1:1", outcome: "Coping plan" },
  { date: "2025-09-21", student: "Rahul K.", type: "Follow-up", outcome: "Rescheduled" },
  { date: "2025-09-22", student: "Priya S.", type: "1:1", outcome: "Improved mood" },
]

export default function ReportsPage() {
  const { toast } = useToast()

  const exportCSV = () =>
    toast({ title: "Export started", description: "Generating CSV in the background" })
  const exportPDF = () =>
    toast({ title: "Export started", description: "Generating PDF in the background" })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
          <Button onClick={exportPDF}>Export PDF</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.student}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.outcome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
