'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const WARM = ['#F97316', '#FDBA74', '#92400E', '#D97706', '#EA580C', '#FB923C']

function fmtAxis(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`
  return `$${n}`
}

export default function DashboardCharts({
  revenueData,
  planData,
}: {
  revenueData: { month: string; value: number }[]
  planData: { name: string; value: number }[]
}) {
  const hasRevenue = revenueData.some((d) => d.value > 0)
  const hasPlan    = planData.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

      {/* Bar chart — 3/5 */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Ingresos últimos 6 meses</h2>
        {!hasRevenue ? (
          <div className="h-44 flex items-center justify-center text-sm text-neutral-300">
            Sin reservas registradas aún
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} barSize={30}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#a3a3a3' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#a3a3a3' }}
                tickFormatter={fmtAxis}
                width={52}
              />
              <Tooltip
                formatter={(v: number) => [`$${v.toLocaleString('es-CO')}`, 'Ingresos']}
                contentStyle={{
                  border: '1px solid #f5f5f5',
                  borderRadius: 10,
                  fontSize: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
                cursor={{ fill: '#fafafa' }}
              />
              <Bar dataKey="value" fill="#F97316" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie chart — 2/5 */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Por tipo de plan</h2>
        {!hasPlan ? (
          <div className="h-44 flex items-center justify-center text-sm text-neutral-300">
            Sin reservas registradas aún
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={planData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {planData.map((_, i) => (
                  <Cell key={i} fill={WARM[i % WARM.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number, name: string) => [v, name]}
                contentStyle={{
                  border: '1px solid #f5f5f5',
                  borderRadius: 10,
                  fontSize: 11,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              />
              <Legend
                iconSize={8}
                iconType="circle"
                formatter={(v) => (
                  <span style={{ fontSize: 10, color: '#a3a3a3' }}>
                    {v.length > 22 ? v.slice(0, 22) + '…' : v}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  )
}
