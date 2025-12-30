import TermsAndConditions from '@/app/components/TermsAndConditions/TermsAndConditions'
import Head from 'next/head'
import React from 'react'

function page() {
  return (

    <>
    <Head>
      <title>Terms & Conditions | Smokenza</title>
<meta
  name="description"
  content="Read Smokenza's Terms & Conditions to understand the rules, guidelines, and policies governing the use of our website and services. Stay informed and shop confidently."
/>

    </Head>
    <div><TermsAndConditions/></div>
    </>
    
  )
}

export default page