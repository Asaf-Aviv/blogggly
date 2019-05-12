import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import hljs from 'highlight.js';
import ReactQuill from 'react-quill';
import Alert from 'react-s-alert';
import debounce from 'lodash.debounce';
import Select from 'react-select';
import { UserContext, MemberFormsContext } from '../../context';
import Container from '../Container';
import utils from '../../utils';
import queries from '../../graphql/queries';

import 'highlight.js/styles/railscasts.css';
import 'react-quill/dist/quill.snow.css';
import './PostEditor.sass';

const saveToLocalStorage = debounce((key, value) => {
  console.log('saving');
  localStorage.setItem(key, value);
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
      ['blockquote', 'code-block'], // 'imgage'
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ direction: 'rtl' }], // text direction
      [{ align: [] }],
      ['clean'], // remove formatting button
    ],
  },
};

const options = [
  { value: 'Programming', label: 'Programming' },
  { value: 'React', label: 'React' },
  { value: 'Art', label: 'Art' },
  { value: 'Movies', label: 'Movies' },
  { value: 'Games', label: 'Games' },
  { value: 'Painting', label: 'Painting' },
];

const PostEditor = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [newPostId, setNewPostId] = useState('');
  const [tags, setTags] = useState([]);

  const postTitleRef = useRef(null);
  const quillRef = useRef(null);

  const { loggedUser, setLoggedUser, isLogged } = useContext(UserContext);
  const { setShowLogin, setShowMemberForms } = useContext(MemberFormsContext);

  useEffect(() => {
    const cachedTitle = localStorage.getItem('title');
    const cachedPostBody = localStorage.getItem('postBody');
    if (cachedTitle) setPostTitle(cachedTitle);
    if (cachedPostBody) setPostBody(cachedPostBody);
    postTitleRef.current.focus();
  }, []);

  useEffect(() => {
    console.log('tags', tags);
  }, [tags]);

  if (newPostId) {
    return (
      <Redirect to={`/post/${newPostId}`} />
    );
  }

  const handleChange = (selectedOptions) => {
    if (selectedOptions.length > 5) {
      Alert.info('You can\'t add more then 5 tags.');
      return;
    }
    setTags(selectedOptions);
    console.log('Option selected:', selectedOptions);
  };

  return (
    <main className="create">
      <Mutation
        mutation={queries.CREATE_POST}
        variables={{
          postInput: {
            title: postTitle,
            body: postBody,
            tags: tags.map(({ value }) => value),
          },
        }}
        errorPolicy="all"
        onError={utils.UIErrorNotifier}
        onCompleted={({ createPost: newPost }) => {
          localStorage.removeItem('postTitle');
          localStorage.removeItem('postBody');
          setLoggedUser({
            ...loggedUser,
            posts: [
              newPost._id,
              ...loggedUser.posts,
            ],
          });
          setNewPostId(newPost._id);
        }}
      >
        {createPost => (
          <Container>
            <textarea
              ref={postTitleRef}
              className="post-title"
              value={postTitle}
              onChange={(e) => {
                setPostTitle(e.target.value);
                saveToLocalStorage('postTitle', e.target.value);
              }}
              placeholder="Enter Post title"
              rows="2"
            />
            <Select
              className="select-categories"
              options={options}
              onChange={handleChange}
              value={tags}
              isMulti
            />
            <ReactQuill
              ref={quillRef}
              value={postBody}
              onChange={(postBodyMarkdown) => {
                setPostBody(postBodyMarkdown);
                saveToLocalStorage('postBody', postBodyMarkdown);
              }}
              {...editorOptions}
            />
            <button
              type="button"
              className="btn btn--primary create-post__btn"
              onClick={() => {
                if (!isLogged) {
                  Alert.info('Please login or signup to post a story.');
                  setShowLogin(true);
                  setShowMemberForms(true);
                  return;
                }

                const postBodyLength = quillRef.current.getEditor().getLength();

                if (!postTitle) {
                  Alert.error('Please enter post title.');
                }
                if (postBodyLength < 10) {
                  Alert.error('Post content is too short.');
                }
                if (!tags.length) {
                  Alert.error('Please add atleast 1 tag to your post.');
                }

                if (!postTitle || !tags.length || postBodyLength < 10) return;

                console.log(postBody);
                createPost();
              }}
            >
              Create Post
            </button>
          </Container>
        )}
      </Mutation>
    </main>
  );
};

export default PostEditor;
