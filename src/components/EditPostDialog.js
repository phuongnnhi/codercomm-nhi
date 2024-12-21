import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import UploadSingleFile from './UploadSingleFile';

function EditPostDialog({ open, onClose, onSubmit, postId, initialContent, initialImage }) {
  const [content, setContent] = useState(initialContent || '');
  const [file, setFile] = useState(initialImage || null);

  useEffect(() => {
    setContent(initialContent);
    setFile(initialImage);
  }, [initialContent, initialImage]);

  
  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(Object.assign(file, { preview: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = () => {
    onSubmit({ postId, content, image: file });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{
        sx: {
          width: '600px', // Explicitly set the width
          maxWidth: 'none', 
        },}} >
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={4}
          margin="dense"
          label="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <UploadSingleFile
          file={file}
          onDrop={handleDrop}
          accept="image/*"
          maxFiles={1}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPostDialog;