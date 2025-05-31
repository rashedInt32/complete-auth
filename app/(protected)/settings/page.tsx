'use client'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useSession } from 'next-auth/react'
import { Navbar } from '../_components/navbar'

const Settings = () => {
  const user = useCurrentUser()
  return (
    <>
      <div className="bg-white p-10 rounded-xl">
        <button type="submit">Sign out</button>
      </div>
    </>
  )
}

export default Settings
