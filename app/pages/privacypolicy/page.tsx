import TermsAndPolicy from '@/app/components/Terms&Policy/Term&Policy'
import Head from 'next/head'
import React from 'react'

function page() {
  return (


<>
<Head>

  <title>Privacy Policy | Smokenza</title>
<meta
  name="description"
  content="Read Smokenza's Privacy Policy to understand how we collect, use, and protect your personal information. Your privacy and security are our top priority."
/>

</Head>

  <div className=' '>
        <TermsAndPolicy/>
    </div>
</>

  
  )
}

export default page