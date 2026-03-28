import { notFound } from 'next/navigation'

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

  return <>{children}</>
}
