import RefundPolicy from '@/app/components/RefundPolicy/RefundPolicy'
import Head from 'next/head'
import React from 'react'

function page() {
  return (


    <>

    <Head>

      <title>Refund Policy | Smokenza</title>
<meta
  name="description"
  content="Read Smokenza's Refund Policy to understand how we handle returns and refunds. Learn about eligibility, process, and timelines to ensure a smooth experience."
/>

    </Head>
     <div className=''>
        <RefundPolicy/>
    </div>
    </>
   
  )
}

export default page