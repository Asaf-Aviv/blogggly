import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import hljs from 'highlight.js';
import ReactQuill from 'react-quill';
import Alert from 'react-s-alert';
import debounce from 'lodash.debounce';
import { UserContext } from '../../context';
import Container from '../Container';
import utils from '../../utils';
import queries from '../../graphql/queries';

import 'highlight.js/styles/railscasts.css';
import 'react-quill/dist/quill.snow.css';
import './PostEditor.sass';

const saveTitleToLocalStorage = debounce((title) => {
  console.log('saving');
  localStorage.setItem('title', title);
}, 1000);

const saveBodyToLocalStorage = debounce((postBody) => {
  console.log('saving');
  localStorage.setItem('postBody', postBody);
}, 1000);

const editorOptions = {
  placeholder: 'Share your story',
  debug: true,
  modules: {
    syntax: {
      highlight: text => hljs.highlightAuto(text).value,
    },
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, true] }],
      [{ font: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      ['blockquote', 'code-block', 'image'],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ direction: 'rtl' }], // text direction
      [{ align: [] }],
      ['clean'], // remove formatting button
    ],
  },
};

const PostEditor = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [newPostId, setNewPostId] = useState('');

  const postTitleRef = useRef(null);

  const { loggedUser } = useContext(UserContext);

  useEffect(() => {
    const cachedTitle = localStorage.getItem('title');
    const cachedPostBody = localStorage.getItem('postBody');
    if (cachedTitle) setTitle(cachedTitle);
    if (cachedPostBody) setBody(cachedPostBody);
    postTitleRef.current.focus();
  }, []);

  if (newPostId) {
    return (
      <Redirect to={`/posts/${newPostId}`} />
    );
  }

  return (
    <Mutation
      mutation={queries.CREATE_POST}
      variables={{
        postInput: {
          author: loggedUser && loggedUser._id,
          title,
          body,
        },
      }}
      errorPolicy="all"
      onError={utils.UIErrorNotifier}
      onCompleted={({ createPost }) => {
        localStorage.removeItem('title');
        localStorage.removeItem('postBody');
        setNewPostId(createPost._id);
      }}
    >
      {(createPost, { loading, error }) => {
        if (loading) return <h1>Loading</h1>;

        return (
          <Container>
            <textarea
              ref={postTitleRef}
              className="post-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                saveTitleToLocalStorage(e.target.value);
              }}
              placeholder="Enter Post title"
              rows="2"
            />
            <ReactQuill
              value={body}
              onChange={(postBody) => {
                setBody(postBody);
                saveBodyToLocalStorage(postBody);
              }}
              {...editorOptions}
            />
            <button
              type="button"
              className="btn btn--primary create-post__btn"
              onClick={() => {
                if (!title) {
                  Alert.error('Please enter post title.');
                }
                if (!body) {
                  Alert.error('Please enter post content.');
                }
                if (!title || !body) return;
                console.log(body);
                createPost();
              }}
            >
            Create Post
            </button>
          </Container>
        );
      }}
    </Mutation>
  );
};

export default PostEditor;
