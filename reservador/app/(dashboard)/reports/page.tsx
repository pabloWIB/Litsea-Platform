import { searchReportFiles } from '@/lib/google/drive'
import ReportsList from '@/components/dashboard/ReportsList'

async function getReports() {
  try {
    return await searchReportFiles()
  } catch {
    return []
  }
}

export default async function ReportsPage() {
  const reports = await getReports()

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Reportes</h1>
        <p className="text-sm text-neutral-400 mt-0.5">
          Historial de reportes mensuales · generados automáticamente el día 1 de cada mes
        </p>
      </div>

      <ReportsList reports={reports} />
    </div>
  )
}
