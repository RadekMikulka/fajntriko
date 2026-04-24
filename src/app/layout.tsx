import type { Metadata } from 'next'
import { Catamaran, Inter } from 'next/font/google'
import './globals.css'

const catamaran = Catamaran({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-catamaran',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FajnTriko.cz — Potisk triček a mikiny na míru',
  description:
    'Potiskujeme trička, mikiny a firemní merch pro jednotlivce, třídy, spolky i firmy. DTF potisk, rychlé dodání, osobní přístup. Praha a okolí.',
  keywords: 'potisk triček, trička na míru, mikiny s potiskem, firemní merch, DTF tisk, Praha',
  openGraph: {
    title: 'FajnTriko.cz — Potisk triček a mikiny na míru',
    description:
      'Potiskujeme trička, mikiny a firemní merch pro jednotlivce, třídy, spolky i firmy. Rychlé dodání, osobní přístup.',
    url: 'https://fajntriko.cz',
    siteName: 'FajnTriko.cz',
    locale: 'cs_CZ',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${catamaran.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-body bg-brand-cream text-brand-dark antialiased">{children}</body>
    </html>
  )
}
