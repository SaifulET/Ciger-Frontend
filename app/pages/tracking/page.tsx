import TrackingPage from '@/app/components/TrackingPage/TrackingPage'
import Head from 'next/head'
import React from 'react'

function page() {
  return (

    <>
    <Head>

      <title>Track Your Order | Smokenza</title>
<meta
  name="description"
  content="Track your Smokenza order easily. Enter your order ID to see the latest status, estimated delivery, and shipping updates for your favorite smoking products."
/>

    </Head>
    
     <div className=''>
        <TrackingPage/>
    </div>
    </>
   
  )
}

export default page