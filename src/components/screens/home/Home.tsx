import { useRef, useState, RefObject, useEffect } from "react";
import nextId from "react-id-generator";
import ChatList from "./chatList/ChatList";
import SpeechRecognation from "./speechRecognation/SpeechRecognation";
import { handlePlaySound } from "utils/soundEffect";
import assistantChatApi from "shared/api/chat";
import { API_URL } from "shared/api/api.config";
import InactivityTracker from "components/ui/inactivityTracker/InactivityTracker";
import styles from "./Home.module.scss";
import { IMessage } from "shared/types/chatWithAssistant";
import { IGetBinaryTreeAnswersResponse } from "shared/types/chatBot";
import i18next from "i18next";

const { getAssistantResponse, getBinaryTreeAnswers } = assistantChatApi;

const initChatList: IMessage[] = [
  {
    text: "Выберите язык / Choose language",
    type: "assistant",
    id: nextId(),
    options: [
      { text: "Английский / English", type: "option", id: 2, lang: "en" },
      { text: "Русский / Russian", type: "option", id: 2, lang: "ru" },
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

  const updateOptionList = ({ yes, no, id, question_ru, question_en }) => {
    const newItem = {
      text: question_ru ?? question_en,
      id,
      type: "assistant",
      options: [
        { id: yes, text: "Yes", type: "option" },
        { id: no, text: "No", type: "option" },
      ],
    };
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
      handlePlaySound(`${API_URL}${audio}`);
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

  const handleOptionClick = async (option: IMessage) => {
    if (option?.lang === "ru") i18next.changeLanguage("ru");
    if (option?.lang === "en") i18next.changeLanguage("en");

    setChatList((prevData) => {
      const lastIndex = prevData.length - 1;
      const updatedData: IMessage[] = prevData.map((item, index) =>
        index === lastIndex ? { ...item, options: null } : item
      );
      return [...updatedData];
    });

    if (option?.id) {
      updateList(option.text, "user", option.id);
      const res = (await getBinaryTreeAnswers(
        option.id
      )) as IGetBinaryTreeAnswersResponse;
      handlePlaySound(res.audio_en ?? res.audio_ru);
      updateOptionList(res);
    }
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className="container">
        {chatList.length > 0 && (
          <ChatList
            chatList={chatList}
            loading={loading}
            onOptionClick={handleOptionClick}
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
