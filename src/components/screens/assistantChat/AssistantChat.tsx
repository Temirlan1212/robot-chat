import { useRef, useState, RefObject } from "react";
import nextId from "react-id-generator";
import ChatList from "./chatList/ChatList";
import SpeechRecognation from "./speechRecognation/SpeechRecognation";
import { handlePlay } from "utils/soundEffect";
import assistantChatApi from "shared/api/chat";
import { API_URL } from "shared/api/api.config";
import InactivityTracker from "components/ui/inactivityTracker/InactivityTracker";
import styles from "./AssistantChat.module.scss";

const { getAssistantResponse } = assistantChatApi;

const initChatList = [
  { text: "Привет, чем могу помочь?", type: "assistant", id: nextId() },
];

function AssistantChat() {
  const [chatList, setChatList] = useState(initChatList);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLInputElement>(null);

  const updateList = (text: string, type: string) => {
    const newItem = { type, text, id: nextId() };
    setChatList((prevMessages) => [...prevMessages, newItem]);
  };

  const scrollBottom = (ref: RefObject<HTMLInputElement>) => {
    if (ref != null && ref?.current) {
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

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={"container"}>
        {chatList.length > 0 && (
          <ChatList chatList={chatList} loading={loading} />
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

export default AssistantChat;
