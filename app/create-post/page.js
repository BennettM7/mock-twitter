import { createClient } from '@/utils/supabase/server';
import CreatePostForm from '../components/create-post-form';
import Navbar from '../components/navbar';

export default async function CreatePostPage() {
    const supabase = createClient()
    
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return(
        <div>   
            <Navbar user={ user } />
            <h1>Create Post</h1>
            <CreatePostForm user={user}/>
        </div>
    )
}
