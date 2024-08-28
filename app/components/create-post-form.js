'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation';

export default function CreatePostForm({ user }) {
  const router = useRouter();
  const supabase = createClient();
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
      setText(e.target.value);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data, error } = await supabase
            .from('posts')
            .insert({ text, author_id: user?.id })
            .single();
      if (error) {
          throw error;
      }
      console.log('Post created:', data);
      // Optionally, you can redirect the user to another page after successful submission
      router.push('feed');
      } catch (error) {
        console.error('Error creating post:', error.message);
      }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter your post..."
        rows={4}
        cols={50}
      />
        <button type="submit">Post</button>
    </form>
  );
}

