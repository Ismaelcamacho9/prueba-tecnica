import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

afterEach(() => {
  cleanup()
})

describe('Button', () => {
  it('renderiza con texto', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('aplica la variante default', () => {
    render(<Button>Default</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-primary')
  })

  it('aplica la variante destructive', () => {
    render(<Button variant="destructive">Delete</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-red-600')
  })

  it('aplica la variante secondary', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-secondary')
  })

  it('aplica la variante ghost', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('hover:bg-accent')
  })

  it('aplica la variante outline', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('border')
  })

  it('aplica tamaño sm', () => {
    render(<Button size="sm">Small</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('h-9')
  })

  it('aplica tamaño lg', () => {
    render(<Button size="lg">Large</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('h-11')
  })

  it('aplica tamaño icon', () => {
    render(<Button size="icon">🔍</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('w-10')
  })

  it('pasa className personalizado', () => {
    render(<Button className="custom-class">Custom</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('custom-class')
  })

  it('soporta disabled', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

describe('Card', () => {
  it('renderiza Card con contenido', () => {
    render(<Card data-testid="card">Card content</Card>)
    expect(screen.getByTestId('card')).toHaveTextContent('Card content')
  })

  it('renderiza CardHeader', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renderiza CardTitle como h3', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title')
  })

  it('renderiza CardDescription', () => {
    render(<CardDescription>Desc</CardDescription>)
    expect(screen.getByText('Desc')).toBeInTheDocument()
  })

  it('renderiza CardContent', () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    expect(screen.getByTestId('content')).toHaveTextContent('Content')
  })

  it('renderiza CardFooter', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer')).toHaveTextContent('Footer')
  })

  it('aplica className personalizado', () => {
    render(<Card data-testid="card" className="custom">Content</Card>)
    expect(screen.getByTestId('card').className).toContain('custom')
  })
})

describe('Input', () => {
  it('renderiza un input', () => {
    render(<Input placeholder="Buscar…" />)
    expect(screen.getByPlaceholderText('Buscar…')).toBeInTheDocument()
  })

  it('aplica className personalizado', () => {
    render(<Input className="custom-input" data-testid="input" />)
    expect(screen.getByTestId('input').className).toContain('custom-input')
  })

  it('soporta disabled', () => {
    render(<Input disabled data-testid="input" />)
    expect(screen.getByTestId('input')).toBeDisabled()
  })
})

describe('Skeleton', () => {
  it('renderiza un div con clase animate-pulse', () => {
    render(<Skeleton data-testid="skeleton" />)
    const el = screen.getByTestId('skeleton')
    expect(el.className).toContain('animate-pulse')
  })

  it('aplica className personalizado', () => {
    render(<Skeleton data-testid="skeleton" className="h-10 w-10" />)
    const el = screen.getByTestId('skeleton')
    expect(el.className).toContain('h-10')
    expect(el.className).toContain('w-10')
  })
})
