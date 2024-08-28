import { createClient } from "@/utils/supabase/server";
import Feed from '../components/feed'
import Navbar from "../components/navbar";

export default async function FeedPage(){
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()
    
    return(
    <div>
        <Navbar user={ user } />
        <Feed user={ user }></Feed>
    </div>
    )
}