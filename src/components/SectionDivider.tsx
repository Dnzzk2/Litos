import type React from 'react'
import { cn } from '~/lib/utils'

interface SectionDividerProps {
  className?: string
  position?: 'top' | 'bottom'
}

export default function SectionDivider({ className, position }: SectionDividerProps): React.ReactElement {
  return (
    <section className={cn('border-y border-border/50', `section-divider-${position}`, className)}>
      <div className="h-1.5 w-full bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] opacity-50" />
    </section>
  )
}
