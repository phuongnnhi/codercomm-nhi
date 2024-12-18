import React from 'react';
import { Avatar, Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Paper, Stack, Typography } from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment, hideDeleteConfirmation, showDeleteConfirmation } from './commentSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmationDialog } from '../../components/ConfirmationDiaglog';

function CommentCard({comment}) {
  const dispatch = useDispatch();
  const { isConfirming, commentIdToDelete } = useSelector((state) => state.comment);

  const handleShowConfirm = () => {
    dispatch(showDeleteConfirmation(comment._id));
  };

  const handleCancelConfirm = () => {
    dispatch(hideDeleteConfirmation());
  };

  const handleDelete = () => {
    dispatch(deleteComment({ commentId: commentIdToDelete }));
    dispatch(hideDeleteConfirmation());
  };
  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Box flexGrow={1}/>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(comment.createdAt)}
          </Typography>
          <IconButton onClick={handleShowConfirm}>
            <DeleteIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />
        </Box>
      </Paper>
          {/* Confirmation Dialog */}
          <ConfirmationDialog
          open={isConfirming && commentIdToDelete === comment._id}
          onClose={handleCancelConfirm}
          onConfirm={handleDelete}
          title = "Are you sure you want to delete this comment?"
          />
    </Stack>
    
  )
}

export default CommentCard;
