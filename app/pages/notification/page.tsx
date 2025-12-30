import NotificationsPage from '@/app/components/Notifications/NotificationsPage'
import Head from 'next/head'
import React from 'react'

function page() {
  return (
<>


<Head>
<title>User Notifications | Smokenza</title>
<meta
  name="description"
  content="Stay updated with the latest alerts from Smokenza. Check your notifications for order updates, promotions, and important account messages to never miss out."
/>

    </Head>
    <div className=''><NotificationsPage/></div>
</>
    
  )
}

export default page