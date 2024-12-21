import React, { useState } from 'react'
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { fDate } from "../../utils/formatTime";
import PostReaction from './PostReaction';
import CommentList from '../comment/CommentList';
import CommentForm from '../comment/CommentForm';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, hideDeleteConfirmation, showDeleteConfirmation, updatePost } from './postSlice';
import { ConfirmationDialog } from '../../components/ConfirmationDiaglog';
import EditPostDialog from '../../components/EditPostDialog';

function PostCard({post}) {
  const dispatch = useDispatch();
  const { isConfirming, postIdToDelete } = useSelector((state) => state.post);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const handleShowConfirm = () => {
    dispatch(showDeleteConfirmation(post._id));
  };

  const handleCancelConfirm = () => {
    dispatch(hideDeleteConfirmation());
  };

  const handleDelete = () => {
    dispatch(deletePost({ postId: postIdToDelete }));
    dispatch(hideDeleteConfirmation());
  };

  const handleEditPost = () => {
    setEditDialogOpen(true); // Open the edit dialog
  };

  const handleEditSubmit = ({ postId, content, image }) => {
    dispatch(updatePost({ postId, content, image })); // Dispatch updatePost action
  };


  return (
    <Card>
        <CardHeader
        disableTypography
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle2"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <>
          <IconButton onClick={handleEditPost}>
            <EditIcon sx={{ fontSize: 30 }} />
          </IconButton>
          <IconButton onClick={handleShowConfirm}>
            <DeleteIcon sx={{ fontSize: 30 }} />
          </IconButton>
          </>
        }
      />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>{post.content}</Typography>

        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}

        <PostReaction post={post} />
        <CommentList postId={post._id} />
        <CommentForm postId={post._id} />
      </Stack>
      {/* Edit Dialog */}
      <EditPostDialog
        open={isEditDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        postId = { post._id }
        initialContent={post.content}
        initialImage={post.image}
      />
      {/* Confirmation Dialog */}
          <ConfirmationDialog
          open={isConfirming && postIdToDelete === post._id}
          onClose={handleCancelConfirm}
          onConfirm={handleDelete}
          title = "Are you sure you want to delete this post?"
          />
    </Card>
  )
}

export default PostCard
