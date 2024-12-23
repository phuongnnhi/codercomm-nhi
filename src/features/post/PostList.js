import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from './postSlice';
import PostCard from './PostCard';
import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';

function PostList({userId}) {
  const [page, setPage] = useState(1);
  const {currentPagePosts, postsById, totalPosts, isLoading} = useSelector(state => state.post)
  const posts = currentPagePosts.map((postId) => postsById[postId])
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) dispatch(getPosts({ userId, page }));
  }, [userId, page, dispatch]);

  return (
    <>
      {posts.map(post => (<PostCard key={post.id} post = {post}/>))} 
      <Box sx={{ display: "flex", justifyContent: "center" }}>
      {totalPosts ? (<LoadingButton
            variant="outlined"
            size="small"
            loading={isLoading}
            onClick={() => setPage((page) => page + 1)}
            disabled={Boolean(totalPosts) && posts.length >= totalPosts}
          >
            Load more
          </LoadingButton>) : (<Typography variant="h6">No Post Yet</Typography>)}
        </Box>
    </>
  )
}

export default PostList
