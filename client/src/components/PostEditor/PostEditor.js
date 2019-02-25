import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import ReactQuill from 'react-quill';
import Alert from 'react-s-alert';
import { UserContext } from '../../context';
import Container from '../Container';
import utils from '../../utils';

import 'react-quill/dist/quill.snow.css';
import './PostEditor.sass';

const CREATE_POST = gql`
  mutation createPost($postInput: PostInput) {
    createPost(postInput: $postInput) {
      _id
      title
      body
    }
  }
`;

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

const editorOptions = {
  placeholder: 'Share your story',
  debug: true,
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      ['image', 'code-block'],
      [],
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
    postTitleRef.current.focus();
  }, []);

  if (newPostId) {
    return (
      <Redirect to={`/posts/${newPostId}`} />
    );
  }

  return (
    <Mutation
      mutation={CREATE_POST}
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
        console.log(createPost);
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
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter Post title"
              rows="1"
            />
            <ReactQuill
              value={body}
              onChange={postTest => setBody(postTest)}
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

// const PostEditor = () => {
//   useEffect(() => {
//     new Quill('#editor', { // eslint-disable-line
//       theme: 'snow',
//     });
//     return () => {
//       document.querySelector('.ql-toolbar').remove();
//     };
//   }, []);
//   return (
//     <div id="editor">
//       <p>Hello World!</p>
//       <p>
//         Some initial
//         <strong>bold</strong>
//         text
//       </p>
//       <br />
//     </div>
//   );
// };
