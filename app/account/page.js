import AccountForm from '../components/account-form'
import { createClient } from '@/utils/supabase/server'
import Navbar from '../components/navbar'

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navbar user={ user } />
      <AccountForm user={user} />
    </>
  )
}