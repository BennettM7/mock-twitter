'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Feed({ user }) {
    const supabase = createClient();
    const [posts, setPosts] = useState([]);

    const getPosts = useCallback(async () => {
        try {
            const { data: postsData, error: postsError } = await supabase.from('posts').select('*').neq("author_id", user.id);
            if (postsError) {
                throw postsError;
            }


            const { data: likesData, error: likesError } = await supabase.from('likes').select('*').eq('profile_id', user.id);
            if (likesError) {
                throw likesError;
            }


            const authorIds = postsData.map(post => post.author_id);
            const { data: authorsData, error: authorsError } = await supabase.from('profiles').select('username, id').in('id', authorIds);
            if (authorsError) {
                throw authorsError;
            }


            const postsWithLikesAndAuthors = postsData.map(post => {
                const likedPost = likesData.find(like => like.post_id === post.id);
                const author = authorsData.find(author => author.id === post.author_id);
                return {
                    ...post,
                    liked: !!likedPost,
                    author_username: author ? author.username : 'Unknown',
                };
            });

            setPosts(postsWithLikesAndAuthors || []);
        } catch (error) {
            console.error('Error fetching posts: ', error.message);
        }
    }, [user.id]);

    const handleLike = async (post) => {
        try {
            const { like_data, like_error } = await supabase.from('likes')
                .insert({ profile_id: user.id, post_id: post.id })
                .single()
            if (like_error) {
                throw like_error;
            }

            const { data, error } = await supabase.from('posts')
                .update({ like_count: post.like_count + 1 })
                .eq('id', post.id)
                .single();
            if (error) {
                throw error;
            }
            
            getPosts();
        } catch (error) {
            console.error('Error updating like count: ', error.message);
        }
    };

    const handleUnlike = async (post) => {
        try {
            const { unlike_data, unlike_error } = await supabase
                .from('likes')
                .delete()
                .eq('profile_id', user.id)
                .eq('post_id', post.id)
            
            if (unlike_error) {
                throw unlike_error;
            }

            const { data, error } = await supabase.from('posts')
                .update({ like_count: post.like_count - 1 })
                .eq('id', post.id)
                .single();
            if (error) {
                throw error;
            }
            // Refresh posts after updating like count
            getPosts();
        } catch (error) {
            console.error('Error updating like count: ', error.message);
        }
    };

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return date.toLocaleString(undefined, options);
    };

    useEffect(() => {
        getPosts();
    }, [getPosts]);


    return (
        <div>
            <h1>Feed</h1>
            {posts.map(post => (
                <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                    <p>Created At: {formatDateTime(post.created_at)}</p>
                    <p>Text: {post.text}</p>
                    <p>Like Count: {post.like_count}</p>
                    <p>Author: {post.author_username}</p>
                    {post.liked ? (
                        <button onClick={() => handleUnlike(post)}>Unlike</button>
                    ) : (
                        <button onClick={() => handleLike(post)}>Like</button>
                    )}
                </div>
            ))}
        </div>
    )
}
