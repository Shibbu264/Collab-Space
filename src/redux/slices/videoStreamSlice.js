// src/redux/slices/videoStreamSlice.js

// Import localStorage
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios'
const initialState = {
  id: '',
  roomid: '',
  lastwatchedduration: '',
  lastwatchedspeed: '',
  lastwatchedlink: '',
  chats: [],
  active:false,
};

const videoStreamSlice = createSlice({
  name: 'videoStream',
  initialState,
  reducers: {
    setVideoStream: (state, action) => {
      // Update Redux store
      Object.assign(state, action.payload);
      // Update localStorage
      localStorage.setItem('videoStream', JSON.stringify(action.payload));
    },
    updateroomid: (state, action) => {
      state.roomid= action.payload;
      // Update localStorage
      localStorage.setItem('videoStream', JSON.stringify(state));
    },
    updateLastWatchedDuration: (state, action) => {
      state.lastwatchedduration = action.payload;
      // Update localStorage
      localStorage.setItem('videoStream', JSON.stringify(state));
    },
    updateLastWatchedSpeed: (state, action) => {
      state.lastwatchedspeed = action.payload;
      // Update localStorage
      localStorage.setItem('videoStream', JSON.stringify(state));
    },
    updateLastWatchedLink: (state, action) => {
      state.lastwatchedlink = action.payload;
      // Update localStorage
      localStorage.setItem('videoStream', JSON.stringify(state));
    },
    addChat: (state, action) => {
      state.chats.push(action.payload);
      // Update localStorage
      localStorage.setItem('videoStream', JSON.stringify(state));
    },
    updateactive: (state, action) => {
      state.active=(action.payload);
      // Update localStorage
      localStorage.setItem('videoStream', JSON.stringify(state));
    }
    
    
  }
});

export const {
  setVideoStream,
  updateroomid,
  updateLastWatchedDuration,
  updateLastWatchedSpeed,
  updateLastWatchedLink,
  addChat,
  updateactive
} = videoStreamSlice.actions;

export default videoStreamSlice.reducer;
export const updateWatchPartyMiddleware = store => next => action => {
  const result = next(action);
  if (
    action.type === updateLastWatchedDuration.type ||
    action.type === updateLastWatchedLink.type ||
    action.type === addChat.type||action.type===updateactive.type
  ) {
  
    const state = store.getState();
    if(state.videoStream.active){
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/updatewatchparty`, state.videoStream)
      .then(response => {
        console.log('Watch party data updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating watch party data:', error);
      });
    }
  }

  return result;
};
