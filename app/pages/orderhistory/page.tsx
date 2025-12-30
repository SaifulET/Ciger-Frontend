import OrderHistoryPage from '@/app/components/OrderHistory/OrderHistoryPage'
import Head from 'next/head'
import React from 'react'

function page() {
  return (

    <>

    <Head>

<title>Order History | Smokenza</title>
<meta
  name="description"
  content="View your complete order history at Smokenza. Track past purchases, review order details, and manage your smoking products orders easily from your account."
/>

    </Head>
    
     <div>
        <OrderHistoryPage/>
    </div>
    </>
   
  )
}

export default page