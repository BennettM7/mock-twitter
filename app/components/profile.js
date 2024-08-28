'use client'
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function Profile({ user, username }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [sameUser, setSameUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url, id`)
        .eq('username', username)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfileData(data);
        if (user && data.id === user.id) {
          setSameUser(true);
        }
        if (data.id !== user.id) {
          const { data: followData, error: followError } = await supabase
            .from('follows')
            .select('*')
            .eq('follower', user.id)
            .eq('followee', data.id)
            .single();

          if (followData) {
            setIsFollowing(true);
          }
        }
      } else {
        // User not found
        setProfileData({ notFound: true });
      }
    } catch (error) {
      console.log(error);
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [username, supabase, user]);

  const getPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('like_count, text, created_at')
        .eq('author_id', profileData.id);

      if (error) {
        throw error;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      alert('Error loading user posts!');
    }
  }, [profileData, supabase]);

  useEffect(() => {
    getProfile();
  }, [username, getProfile]);

  useEffect(() => {
    if (profileData && profileData.id) {
      getPosts();
    }
  }, [profileData, getPosts]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower', user.id)
          .eq('followee', profileData.id);
        setIsFollowing(false);
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert([{ follower: user.id, followee: profileData.id }]);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error.message);
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
      hour12: false,
    };
    return date.toLocaleString(undefined, options);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (profileData && profileData.notFound) {
    return <h1>User {username} does not exist.</h1>;
  }

  return (
    <div>
      <h1>{profileData.username}</h1>
      <h2>{profileData.full_name}</h2>
      <p>Website: {profileData.website}</p>
      {sameUser ? (
        <Link href="/account">
          <button>Edit Profile</button>
        </Link>
      ) : (
        <button onClick={handleFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
      )}
      <h3>User's Posts:</h3>
      {posts.map(post => (
                <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                    <p>Created At: {formatDateTime(post.created_at)}</p>
                    <p>Text: {post.text}</p>
                    <p>Like Count: {post.like_count}</p>
                </div>
            ))}
    </div>
  );
}
