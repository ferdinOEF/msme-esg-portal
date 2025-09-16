import './globals.css';import Navbar from '@/components/Navbar'
export const metadata={title:'MSME ESG Compliance Portal',description:'Single-window ESG compliance & schemes for MSMEs (Goa, India)'}
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang='en'><body><Navbar/><main className='container py-6'>{children}</main></body></html>)}
