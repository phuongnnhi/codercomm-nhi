import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { POST_PER_PAGE } from "../../app/config";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
    isLoading: false,
    error: null,
    postsById: {},
    totalPosts: 0,
    currentPagePosts: [],
    isConfirming: false, // Tracks if the confirmation modal is visible
    postIdToDelete: null,
    updatedPost: null,
}

const slice = createSlice({
    name:"post",
    initialState,
    reducers:{
        startLoading(state) {
            state.isLoading= true;
        },
        hasError(state, action) {
            state.isLoading= false;
            state.error = action.payload;
        },
        createPostSuccess(state, action) {
            state.isLoading= false;
            state.error = null;
            const newPost = action.payload;
            if (state.currentPagePosts.length % POST_PER_PAGE === 0)
                state.currentPagePosts.pop();
            state.postsById[newPost._id] = newPost;
            state.totalPosts += 1;
            state.currentPagePosts.unshift(newPost._id)
        },
        getPostSuccess(state, action) {
            state.isLoading= false;
            state.error = null;
            const {count, posts} = action.payload
            posts.forEach(post => {
                state.postsById[post._id] = post;
                if (!state.currentPagePosts.includes(post._id))
                    state.currentPagePosts.push(post._id)
            }
            )
            state.totalPosts = count;
        },
        sendPostReactionSuccess(state, action) {
            state.isLoading = false;
            state.error = null;
            const {postId, reactions} = action.payload;
            state.postsById[postId].reactions = reactions;
        },
        resetPosts(state, action) {
            state.postsById = {};
            state.currentPagePosts = [];
        },
        deletePostSuccess(state, action) {
            state.isLoading= false;
            state.error = null;
            const { postId } = action.payload;
            // Remove post from postsById
            delete state.postsById[postId];
            // Remove post ID from currentPagePosts
            state.currentPagePosts = state.currentPagePosts.filter((id) => id !== postId);
        },
        showDeleteConfirmation(state, action) {
            state.isConfirming = true;
            state.postIdToDelete = action.payload; // Set the ID of the post to be deleted
        },
        hideDeleteConfirmation(state) {
            state.isConfirming = false;
            state.postIdToDelete = null; // Clear the post ID when hiding the modal
        },
        updatePostSuccess(state, action) {
            state.isLoading = false;
            state.error = null;
            const updatePost = action.payload;
            state.postsById[updatePost._id] = updatePost;        
        }
        }
    }
)

export const createPost = ({content, image}) => async(dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        //upload image to cloudinary
        const imageUrl = await cloudinaryUpload(image);
        const response = await apiService.post("/posts",{
            content,
            image: imageUrl,
        });
        dispatch(slice.actions.createPostSuccess(response.data))
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
    }
}

export const getPosts = ({userId, page, limit = POST_PER_PAGE}) => async(dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const params = {page, limit}
        const response = await apiService.get(`/posts/user/${userId}`,{
            params,
        });
        if (page === 1) dispatch(slice.actions.resetPosts());
        dispatch(slice.actions.getPostSuccess(response.data))
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
    }
};

export const sendPostReaction = ({postId, emoji}) => async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const response = await apiService.post(`/reactions`, {
            targetType: "Post",
            targetId: postId,
            emoji
        });
        dispatch(
            slice.actions.sendPostReactionSuccess({
                postId,
                reactions: response.data,
            })
        )
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
        
    }
}

export const updatePost = ({postId, content, image}) => async(dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        //upload image to cloudinary
        const imageUrl = image ? await cloudinaryUpload(image) : null;
        const response = await apiService.put(`/posts/${postId}`,{
            content,
            image: imageUrl,
        });
        dispatch(slice.actions.updatePostSuccess(response.data))
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
    }
}

export const deletePost = ({postId}) => async(dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
       await apiService.delete(`/posts/${postId}`);
        dispatch(
            slice.actions.deletePostSuccess({
                postId,
            })
        )
    } catch (error) {
        dispatch(slice.actions.hasError(error.message))
        
    }
}
 
export const { startLoading, createPostSuccess, hasError, deletePostSuccess, 
    showDeleteConfirmation, hideDeleteConfirmation  } = slice.actions;
export default slice.reducer;