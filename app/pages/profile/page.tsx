import ProfilePage from '@/app/components/Profile/Profile'
import Head from 'next/head'
import React from 'react'

function page() {
  return (

    <>
    <Head>


      <title>User Profile | Smokenza</title>
<meta
  name="description"
  content="Manage your Smokenza account from your user profile. Update personal information, view order history, and customize your preferences easily and securely."
/>

    </Head>
    
    <div className=''>
        <ProfilePage/>
    </div>
    </>
    
  )
}

export default page