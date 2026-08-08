import { cn } from '#lib/utils'
import type { ReactNode } from 'react'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  onRowClick?: (row: T) => void
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 rounded bg-muted animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export function Table<T extends object>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found.',
  className,
  onRowClick,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isLoading ? (
            <SkeletonRows cols={columns.length} />
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'transition-colors hover:bg-muted/30',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn('px-4 py-3 whitespace-nowrap', col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.key as keyof T] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
