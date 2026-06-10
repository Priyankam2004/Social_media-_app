import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const fetchPosts = createAsyncThunk('posts/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/posts', { headers: authHeader() });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch posts');
  }
});

export const createPost = createAsyncThunk('posts/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/posts', formData, {
      headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create post');
  }
});

export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/posts/${id}`, { headers: authHeader() });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete post');
  }
});

export const likePost = createAsyncThunk('posts/like', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/posts/${id}/like`, {}, { headers: authHeader() });
    return { id, likes: res.data.likes };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to like post');
  }
});

export const addComment = createAsyncThunk('posts/addComment', async ({ postId, text }, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      `/api/posts/${postId}/comments`,
      { text },
      { headers: authHeader() }
    );
    return { postId, comment: res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add comment');
  }
});

export const deleteComment = createAsyncThunk('posts/deleteComment', async ({ postId, commentId }, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/posts/${postId}/comments/${commentId}`, { headers: authHeader() });
    return { postId, commentId };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete comment');
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: { posts: [], loading: false, error: null },
  reducers: {
    clearPostError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => { state.loading = false; state.posts = action.payload; })
      .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createPost.fulfilled, (state, action) => { state.posts.unshift(action.payload); })
      .addCase(createPost.rejected, (state, action) => { state.error = action.payload; })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p._id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.id);
        if (post) post.likes = action.payload.likes;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) post.comments.push(action.payload.comment);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          post.comments = post.comments.filter(c => c._id !== action.payload.commentId);
        }
      });
  },
});

export const { clearPostError } = postSlice.actions;
export default postSlice.reducer;
