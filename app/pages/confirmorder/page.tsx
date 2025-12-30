import OrderConfirmation from '@/app/components/ConfirmOrder/ConfirmOrder'
import Head from 'next/head'
import React from 'react'

function page() {
  return (


    <>
    <Head>
<title>Order Confirmation | Smokenza</title>
<meta
  name="description"
  content="Thank you for your order at Smokenza! Your purchase has been successfully confirmed. Track your order and enjoy fast delivery of your favorite smoking products."
/>

    </Head>
    
      <div className=' py-[16px] md:py-[60px]  px-[16px] md:px-[32px]'>
      <OrderConfirmation/>
    </div>
    </>
  
  )
}

export default page