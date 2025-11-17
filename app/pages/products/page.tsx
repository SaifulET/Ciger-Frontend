import PriceRangeBar from '@/app/components/Product/Pricerange'
import ProductsPage from '@/app/components/Product/ProductPages'
import React, { Suspense } from 'react'

function page() {
  return (
    <div className='md:p-8'>
        <Suspense fallback={<div>Loading...</div>}>
      <ProductsPage />
    </Suspense>
    </div>
  )
}

export default page