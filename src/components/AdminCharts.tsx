import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card } from "@/components/ui/card";

const COLORS = ["#3aa9b8", "#6dd49a", "#f0b964", "#e36b6b"];

interface Props {
  perDay: { day: string; count: number }[];
  riskBuckets: { name: string; value: number }[];
}

export default function AdminCharts({ perDay, riskBuckets }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5">
        <h2 className="font-semibold">Assessments per day</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perDay}>
              <XAxis dataKey="day" stroke="currentColor" fontSize={12} />
              <YAxis stroke="currentColor" fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#3aa9b8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="p-5">
        <h2 className="font-semibold">Risk distribution</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={riskBuckets} dataKey="value" nameKey="name" outerRadius={80} label>
                {riskBuckets.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
