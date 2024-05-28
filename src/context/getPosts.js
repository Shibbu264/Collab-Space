import React, { createContext, useState } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [Posts, setPosts] = useState([]);

  return (
    <PostContext.Provider value={{ Posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};
