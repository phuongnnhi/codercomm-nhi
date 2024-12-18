import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { COMMENTS_PER_POST } from "../../app/config";

const initialState = {
    isLoading: false,
    error: null,
    commentsById: {},
    commentsByPost: {},
    currentPageByPost: {},
    totalCommentsByPost: {},
    isConfirming: false, // Tracks if the confirmation modal is visible
    commentIdToDelete: null,
}

const slice = createSlice({
    name:"comment",
    initialState,
    reducers:{
    startLoading(state) {
        state.isLoading = true;
      },

      hasError(state, action) {
        state.isLoading = false;
        state.error = action.payload;
      },

      createCommentSuccess(state, action) {
        state.isLoading = false;
        state.error = null;
      },
      getCommentSuccess(state, action) {
        state.isLoading = false;
        state.error = null;
        const {postId, comments, count, page} = action.payload;
        comments.forEach(
            (comment) => (state.commentsById[comment._id] = comment)
        );
        state.commentsByPost[postId] = comments
        .map((comment) => comment._id)
        .reverse()
        state.totalCommentsByPost[postId] = count;
        state.currentPageByPost[postId] = page;
      },
      sendCommentReactionSuccess(state, action) {
        state.isLoading = false;
        state.error = null;
        const {commentId, reactions} = action.payload;
        state.commentsById[commentId].reactions = reactions;
    },
     deleteCommentSuccess(state,action) {
        state.isLoading = false;
        state.error = null;
        const {commentId} = action.payload;
        const postId = Object.keys(state.commentsByPost).find((postId) =>
            state.commentsByPost[postId].includes(commentId)
        );
        delete state.commentsById[commentId];
        if (postId) {
            state.commentsByPost[postId] = state.commentsByPost[postId].filter(
                (id) => id !== commentId
            );
            state.totalCommentsByPost[postId] -= 1;
        }
     },
     showDeleteConfirmation(state, action) {
        state.isConfirming = true;
        state.commentIdToDelete = action.payload; // Set the ID of the post to be deleted
    },
    hideDeleteConfirmation(state) {
        state.isConfirming = false;
        state.commentIdToDelete = null; // Clear the post ID when hiding the modal
    }     
    }
});

export default slice.reducer;

export const createComment = ({postId, content}) => async(dispatch) =>{
    dispatch(slice.actions.startLoading());
    try {
        const response = await apiService.post("/comments", {
            content,
            postId
        });
        dispatch(slice.actions.createCommentSuccess(response.data));
        dispatch(getComments({postId}));
    } catch (error) {
        dispatch(slice.actions.hasError(error.message));
    }
}

export const getComments = ({postId, page = 1, limit = COMMENTS_PER_POST}) => async(dispatch) =>{
    dispatch(slice.actions.startLoading());

    try {
        const params = {
            page: page,
            limit: limit,
        }
        const response = await apiService.get(`/posts/${postId}/comments`, {
            params,
        });
        dispatch(slice.actions.getCommentSuccess({...response.data, postId, page}))
    } catch (error) {
        dispatch(slice.actions.hasError(error.message));
    }
}

export const sendCommentReaction = ({commentId, emoji}) => async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const response = await apiService.post(`/reactions`, {
            targetType: "Comment",
            targetId: commentId,
            emoji
        });
        dispatch(
            slice.actions.sendCommentReactionSuccess({
                commentId,
                reactions: response.data,
            })
        )
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
        
    }
}
export const deleteComment = ({commentId}) => async(dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
       await apiService.delete(`/comments/${commentId}`);
        dispatch(
            slice.actions.deleteCommentSuccess({
                commentId,
            })
        )
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
        
    }
}

export const {
    startLoading,
    hasError,
    createCommentSuccess,
    getCommentSuccess,
    sendCommentReactionSuccess,
    deleteCommentSuccess,
    showDeleteConfirmation,
    hideDeleteConfirmation
} = slice.actions;