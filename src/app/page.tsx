import Link from 'next/link'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'


export default function Home() {
  return (

    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome!</h2>
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
    
        <Suspense fallback={<div>Loading...</div>}>
        
        </Suspense>
      </div>
    </div>
 
  )
}