import { createClient } from '@/utils/supabase/server'
import Profile from '../components/profile'
import Navbar from '../components/navbar'

export default async function ProfilePage({params}){
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()


    return (
        <>
            <Navbar user={ user } />
            <Profile user={user} username={params.username}/>
        </>
    )
}