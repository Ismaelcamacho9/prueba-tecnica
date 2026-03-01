import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'

type NotFoundStateProps = {
  title: string
  description: string
  ctaLabel?: string
}

const NotFoundState = ({
  title,
  description,
  ctaLabel = 'Volver al catálogo',
}: NotFoundStateProps) => {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border bg-card p-8 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Link
        to="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {ctaLabel}
      </Link>
    </section>
  )
}

export default NotFoundState
