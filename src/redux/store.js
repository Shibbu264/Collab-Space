import {configureStore,getDefaultMiddleware} from "@reduxjs/toolkit"
import videoStreamReducer, { updateWatchPartyMiddleware } from "../redux/slices/videoStreamSlice"

const loadState = () => {
    try {
      const serializedState = localStorage.getItem('videoStream');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };


const store =configureStore({
    reducer:{
        videoStream:videoStreamReducer,
    },
    preloadedState:
    {videoStream:loadState()},
    middleware:getDefaultMiddleware =>
        getDefaultMiddleware().concat(updateWatchPartyMiddleware),

})

export default store;