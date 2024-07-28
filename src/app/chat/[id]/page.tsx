// app/chat/[id]/page.tsx

import ChatPage from '@/app/components/ChatPage';


interface Params {
  id: string;
}

const Chat = ({ params }: { params: Params }) => {
  const { id } = params;

  return (
    <>
      <ChatPage id={id} />
    </>
  );
};

export default Chat;
