import { useSettings, useUpdateCompany, useUpdateCarpoolConfig } from '../hooks'
import { CompanyForm } from '../components/CompanyForm'
import { CarpoolConfigForm } from '../components/CarpoolConfigForm'
import type { CompanySettings, CarpoolConfig } from '../types'
import { Building2, Settings2 } from 'lucide-react'

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description: string
  icon: typeof Building2
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-start gap-3 border-b border-border px-6 py-5 bg-muted/30">
        <div className="rounded-xl bg-primary/10 p-2.5 shadow-sm">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings()
  const { mutate: saveCompany, isPending: savingCo } = useUpdateCompany()
  const { mutate: saveCarpool, isPending: savingCp } = useUpdateCarpoolConfig()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        {[0, 1].map((i) => (
          <div key={i} className="h-72 rounded-2xl border border-border bg-card animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Configuration</div>
            <h2 className="text-4xl font-extrabold tracking-tight">Settings</h2>
            <p className="mt-2 text-muted-foreground">Configure your company and carpool programme.</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectionCard
          title="Company Information"
          description="Basic details about your organisation"
          icon={Building2}
        >
          <CompanyForm
            defaultValues={settings?.company}
            onSubmit={(data: CompanySettings) => saveCompany(data)}
            isPending={savingCo}
          />
        </SectionCard>

        <SectionCard
          title="Carpool Configuration"
          description="Fuel costs, allowances, and booking rules"
          icon={Settings2}
        >
          <CarpoolConfigForm
            defaultValues={settings?.carpool}
            onSubmit={(data: CarpoolConfig) => saveCarpool(data)}
            isPending={savingCp}
          />
        </SectionCard>
      </div>
    </div>
  )
}
