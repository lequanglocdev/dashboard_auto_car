import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore';
import React from 'react'

const Overview = () => {
  const { signOut } = useAuthStore();
  const handleSignOut = async () => {
    await signOut();
  }
  return (
    <div>Overview
      <Button onClick={handleSignOut}>Đăng xuất</Button>
    </div>
  )
}

export default Overview
