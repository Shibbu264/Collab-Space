// components/EditorComponent.js

import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';

export default function  EditorComponent1 (){
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editor',
      // Add your Editor.js configuration options here
      // For example:
      // tools: {
      //   // Add your custom tools if needed
      // }
    });

    editorRef.current = editor;

    return () => {
      // Cleanup when the component is unmounted
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  return (<div id="editor"></div>);
};


