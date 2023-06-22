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
import { getItem } from "services/localStorage.service";
import { chatMessageTypes } from "shared/constants/chat";
import { startOverChat, initChatList } from "utils/chatScripts";
import { OnInitAssistant } from "assets/soundEffects";

const { getAssistantResponse, getBinaryTreeAnswers } = assistantChatApi;

function Home() {
  const [chatList, setChatList] = useState<IMessage[]>(initChatList);
  const [loading, setLoading] = useState(false);
  const [isAssistantActivated, setIsAssistantActivated] = useState(false);
  const [isSplitScreenActivated, setIsSplitScreenActivated] = useState(false);
  const containerRef = useRef<HTMLInputElement>(null);

  const updateList = (text: string, type: string, id = nextId()) => {
    const newItem: IMessage = { type, text, id };
    setChatList((prevMessages) => [...prevMessages, newItem]);
  };

  const updateListWithOptions = ({ yes, no, id, question }) => {
    const newItem: IMessage = {
      text: question,
      id,
      type: "assistant",
    };
    if (!no && !yes) {
      newItem.options = [startOverChat];
    } else {
      newItem.options = [
        { id: yes, text: "Yes", type: "option" },
        { id: no, text: "No", type: "option" },
      ];
    }

    setChatList((prevMessages) => [...prevMessages, newItem]);
  };

  const scrollBottom = (ref: RefObject<HTMLInputElement>) => {
    if (ref != null && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  async function uploadAudioText(message: string) {
    scrollBottom(containerRef);

    try {
      setLoading(true);
      const { text, audio } = await getAssistantResponse(message);
      handlePlaySound(`${API_URL}/${audio}`);
      updateList(text, "assistant");
    } catch {
      updateList("Error, can you repeat it?", "error");
    } finally {
      setLoading(false);
      scrollBottom(containerRef);
    }
  }

  const handleInactive = () => {
    window.location.reload();
  };

  const handleUpdateLastItemOptions = (payload: any) => {
    setChatList((prevData) => {
      const lastIndex = prevData.length - 1;
      const updatedData: IMessage[] = prevData.map((item, index) =>
        index === lastIndex ? { ...item, options: payload } : item
      );
      return [...updatedData];
    });
  };

  const handleBinaryTreeAnswers = async (option: IMessage) => {
    const lang = getItem("i18nextLng");
    handleUpdateLastItemOptions(null);

    if (option?.id) {
      updateList(option.text, "user", option.id);
      try {
        setLoading(true);
        const res = (await getBinaryTreeAnswers(
          option.id
        )) as IGetBinaryTreeAnswersResponse;

        if (lang) {
          handlePlaySound(res["audio_" + lang]);
          updateListWithOptions({ ...res, question: res["question_" + lang] });
        }
      } catch {
        updateList("Error, can you repeat it?", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOptionClick = async (option: IMessage) => {
    if (option?.lang === chatMessageTypes.RU) i18next.changeLanguage("ru");
    if (option?.lang === chatMessageTypes.EN) i18next.changeLanguage("en");
    if (String(option?.id) === chatMessageTypes.ACTIVATE_ASSISTANT_ID) {
      handlePlaySound(OnInitAssistant);
      if (!isAssistantActivated) setIsAssistantActivated(true);
      handleUpdateLastItemOptions(null);
      updateList(option.text, "user", option.id);
      handleUpdateLastItemOptions([startOverChat]);
      scrollBottom(containerRef);
      return;
    }
    if (option?.action === chatMessageTypes.START_OVER_CHAT) {
      handlePlaySound("");
      setChatList((prev) => initChatList);
      if (isAssistantActivated) setIsAssistantActivated(false);
      setIsSplitScreenActivated(false);
      return;
    }

    handleBinaryTreeAnswers(option);
  };

  useEffect(() => {
    if (
      chatList[chatList.length - 1].text.includes(
        "//e.customs.gov.kg/passenger-declaration"
      )
    ) {
      setIsSplitScreenActivated(true);
    }
    scrollBottom(containerRef);
  }, [chatList]);

  return (
    <div className={isSplitScreenActivated ? styles.iframeWrapper : ""}>
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

        {isAssistantActivated && (
          <SpeechRecognation
            className="container"
            uploadAudioText={uploadAudioText}
            updateList={updateList}
            loading={loading}
          />
        )}

        <InactivityTracker
          onInactive={handleInactive}
          timeoutDuration={15 * 1000}
        />
      </div>

      {isSplitScreenActivated && (
        <div className={styles["external-website"]}>
          <iframe
            src="https://e.customs.gov.kg/passenger-declaration"
            title="Website"
            width="100%"
            height="100%"
          />
        </div>
      )}
    </div>
  );
}

export default Home;
