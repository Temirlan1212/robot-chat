import { useRef, useState, RefObject, useEffect } from "react";
import nextId from "react-id-generator";
import ChatList from "./chatList/ChatList";
import SpeechRecognation from "./speechRecognation/SpeechRecognation";
import { handlePlay } from "utils/soundEffect";
import assistantChatApi from "shared/api/chat";
import { API_URL } from "shared/api/api.config";
import InactivityTracker from "components/ui/inactivityTracker/InactivityTracker";
import styles from "./Home.module.scss";
import { IMessage } from "shared/types/chatWithAssistant";

const { getAssistantResponse } = assistantChatApi;

const initChatList: IMessage[] = [
  { text: "enterPassword", type: "assistant", id: nextId() },
  {
    text: "Вы хотите дальше продолжать?",
    type: "assistant",
    id: nextId(),
    options: [
      { text: "Да", type: "option", id: nextId() },
      { text: "Нет", type: "option", id: nextId() },
    ],
  },
];

function Home() {
  const [chatList, setChatList] = useState<IMessage[]>(initChatList);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLInputElement>(null);

  const updateList = (text: string, type: string, id = nextId()) => {
    const newItem: IMessage = { type, text, id };
    setChatList((prevMessages) => [...prevMessages, newItem]);
  };

  const scrollBottom = (ref: RefObject<HTMLInputElement>) => {
    if (ref != null && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  async function uploadAudioText(text: string) {
    scrollBottom(containerRef);

    try {
      setLoading(true);
      const { response, audio } = await getAssistantResponse(text);
      handlePlay(`${API_URL}${audio}`);
      updateList(response, "assistant");
    } catch {
      updateList("Ошибка, можете повторить", "error");
    } finally {
      setLoading(false);
      scrollBottom(containerRef);
    }
  }

  const handleInactive = () => {
    console.log("User is inactive for 3 minutes");
  };

  const handleClick = (option: IMessage) => {
    setChatList((prevData) => {
      const lastIndex = prevData.length - 1;
      const updatedData: IMessage[] = prevData.map((item, index) =>
        index === lastIndex ? { ...item, options: null } : item
      );
      return [...updatedData];
    });

    updateList(option.text, "user", option.id);
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className="container">
        {chatList.length > 0 && (
          <ChatList
            chatList={chatList}
            loading={loading}
            onOptionClick={handleClick}
          />
        )}
      </div>

      <SpeechRecognation
        className="container"
        uploadAudioText={uploadAudioText}
        updateList={updateList}
        loading={loading}
      />

      <InactivityTracker
        onInactive={handleInactive}
        timeoutDuration={3 * 60 * 1000}
      />
    </div>
  );
}

export default Home;
