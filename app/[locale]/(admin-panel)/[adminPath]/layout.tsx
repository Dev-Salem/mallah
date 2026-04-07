import { notFound } from 'next/navigation'
import { Fira_Code, Fira_Sans } from 'next/font/google'

const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' })
const firaSans = Fira_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-fira-sans' })

const ADMIN_PANEL_PATH = process.env.ADMIN_PANEL_PATH || ''

export default async function AdminRootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ adminPath: string; locale: string }>
}) {
  const { adminPath } = await params
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AdminRootLayout] Received path: "${adminPath}", Expected: "${ADMIN_PANEL_PATH}"`)
  }

  // Security check: Only allow access if the path exactly matches our obfuscated path
  if (adminPath !== ADMIN_PANEL_PATH) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AdminRootLayout] Path mismatch! Returning 404.`)
    }
    return notFound()
  }

  return (
    <div 
      className={`${firaCode.variable} ${firaSans.variable} h-full w-full`}
      style={{
        '--font-sans-internal': 'var(--font-fira-sans), ui-sans-serif, system-ui, sans-serif',
        '--font-mono-internal': 'var(--font-fira-code), ui-monospace, monospace'
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
