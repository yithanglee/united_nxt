import { NextResponse } from 'next/server'
import type { Product } from '@/lib/types'


export async function GET() {
  // try {
  //   const res = await fetch(API_URL)
  //   if (!res.ok) throw new Error('Failed to fetch products')
  //   const products: Product[] = await res.json()
  //   return NextResponse.json(products)
  // } catch (error) {
  //   console.error('Error fetching products:', error)
  //   return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  // }
  return NextResponse.json([])
}