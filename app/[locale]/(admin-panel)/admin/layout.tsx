import { Fira_Code, Fira_Sans } from 'next/font/google'

const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' })
const firaSans = Fira_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-fira-sans' })

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
