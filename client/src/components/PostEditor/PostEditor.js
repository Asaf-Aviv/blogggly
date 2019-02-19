import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Alert from 'react-s-alert';
import { UserContext } from '../../context';

const CREATE_POST = gql`
  mutation createPost($postInput: PostInput) {
    createPost(postInput: $postInput) {
      _id
      title
      body
    }
  }
`;

const PostEditor = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const { loggedUser } = useContext(UserContext);

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
      onCompleted={({ createPost }) => {
        console.log(createPost);
      }}
    >
      {(createPost, { loading, error }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createPost();
          }}
        >
          <input onChange={e => setTitle(e.target.value)} value={title} type="text" placeholder="title" />
          <input onChange={e => setBody(e.target.value)} value={body} type="text" placeholder="body" />
          <button type="submit">Create Post</button>
          {error && error.graphQLErrors.forEach(({ message }) => (
            Alert.error(message)
          ))}
        </form>
      )}
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
