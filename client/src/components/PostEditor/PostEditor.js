import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import hljs from 'highlight.js';
import ReactQuill from 'react-quill';
import Alert from 'react-s-alert';
import { debounce } from 'lodash';
import Select from 'react-select';
import { UserContext, MemberFormsContext } from '../../context';
import Container from '../Container';
import utils from '../../utils';
import queries from '../../graphql/queries';

import 'highlight.js/styles/railscasts.css';
import 'react-quill/dist/quill.snow.css';
import './PostEditor.sass';
import Button from '../Button';

const saveToLocalStorage = debounce((key, value) => {
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

  const { setLoggedUser, isLogged } = useContext(UserContext);
  const { setShowLogin, setShowMemberForms } = useContext(MemberFormsContext);

  useEffect(() => {
    const cachedTitle = localStorage.getItem('title');
    const cachedPostBody = localStorage.getItem('postBody');
    if (cachedTitle) setPostTitle(cachedTitle);
    if (cachedPostBody) setPostBody(cachedPostBody);
    postTitleRef.current.focus();
  }, []);

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
  };

  return (
    <div className="create">
      <Helmet>
        <title>Create - Blogggly</title>
      </Helmet>
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

          setLoggedUser((draft) => {
            draft.posts.unshift(newPost._id);
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
            <Button
              classes="btn btn--primary create-post__btn"
              text="Create Post"
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

                createPost();
              }}
            />
          </Container>
        )}
      </Mutation>
    </div>
  );
};

export default PostEditor;
