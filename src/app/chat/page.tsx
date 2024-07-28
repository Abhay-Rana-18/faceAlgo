// app/chat/[id]/page.tsx

import ChatPage from '@/app/components/ChatPage';


interface Params {
  id: string;
}

const Chat = () => {
  return (
    <>
      <ChatPage id={''} />
    </>
  );
};

export default Chat;
