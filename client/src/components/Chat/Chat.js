import React, { useState, useContext } from 'react';
import UserAvatar from '../UserAvatar';
import ChatStatusBox from '../ChatStatusBox';
import Divider from '../Divider';
import { UserContext } from '../../context';
import utils from '../../utils';

import './Chat.sass';

const ChatBoxTextArea = () => {
  const [message, setMessage] = useState('');

  return (
    <form
      onSubmit={e => e.preventDefault()}
      className="chat-box__message-form"
    >
      <textarea
        onChange={e => setMessage(e.target.value)}
        value={message}
        className="chat-box__textarea"
        rows="3"
      />
      <button className="chat-box__send-btn" type="submit">
        <i className="fas fa-paper-plane" />
      </button>
    </form>
  );
};

const ChatBox = ({
  avatar, username, messages, closeChatBox,
}) => (
  <div className="chat-box">
    <div className="chat-box__header">
      <UserAvatar width={40} avatar={avatar} username={username} />
      <span>{username}</span>
      <button type="button" onClick={closeChatBox}>X</button>
    </div>

    <div className="chat-box__messages-list-container">
      <ul
        className="chat-box__messages-list"
        onMouseEnter={utils.lockScrollBody}
        onMouseLeave={utils.unlockScrollBody}
        data-simplebar
      >
        <li className="chat-box__message">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, sed.
        </li>
        <li className="chat-box__message chat-box__message--self">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deleniti, sed.
        </li>
        <li className="chat-box__message">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Nam unde volreiciendis molestiae  reiciendis beatae id itaque est,
          fuga tempora eligendi, sapiente corrupti! Cumque, suscipit dolore.
        </li>
      </ul>
    </div>
    <ChatBoxTextArea />
  </div>
);

const Chat = () => {
  const { loggedUser } = useContext(UserContext);
  const [chatMessages, setChatMessages] = useState({});
  const [openChatBoxes, setOpenChatBoxes] = useState([]);

  const closeChatBox = username => () => {
    console.log('closing chat for', username);
    setOpenChatBoxes(prevState => prevState
      .filter(openUsername => openUsername !== username));
  };

  const openChatBox = username => () => {
    if (!openChatBoxes.includes(username)) {
      setOpenChatBoxes([...openChatBoxes, username]);
    }
  };

  if (!loggedUser) return null;

  return (
    <div className="chat">
      <header className="chat__header">
        <UserAvatar
          avatar={loggedUser.avatar}
          username={loggedUser.username}
        />
        <span className="chat__header-username">{loggedUser.username}</span>
        <ChatStatusBox />
      </header>
      <Divider size="md" />
      <div className="chat__users-container">
        <ul
          className="chat__users-list"
          onMouseEnter={utils.lockScrollBody}
          onMouseLeave={utils.unlockScrollBody}
          data-simplebar
        >
          {['asafaviv', 'mor', 'chen'].map(name => (
            <li className="chat__users-list-item" onClick={openChatBox(name)}>
              <UserAvatar
                width={40}
                avatar={loggedUser.avatar}
                username={name}
              />
              <div className="chat-user__container">
                <span className="chat-user__username">{name}</span>
                <span className="chat-user__body-preview">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit, numquam!</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-boxes__container">
        {openChatBoxes.map(username => (
          <ChatBox
            avatar={loggedUser.avatar}
            username={username}
            messages={chatMessages[username]}
            closeChatBox={closeChatBox(username)}
          />
        ))}
      </div>
    </div>
  );
};

export default Chat;
