import React, { useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const PostEditor = () => {
  useEffect(() => {
    new Quill('#editor', { // eslint-disable-line
      theme: 'snow',
    });
    return () => {
      document.querySelector('.ql-toolbar').remove();
    };
  }, []);
  return (
    <div id="editor">
      <p>Hello World!</p>
      <p>
        Some initial
        <strong>bold</strong>
        text
      </p>
      <br />
    </div>
  );
};

export default PostEditor;
