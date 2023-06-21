import nextId from "react-id-generator";
import { chatMessageTypes } from "shared/constants/chat";
import { IMessage } from "shared/types/chatWithAssistant";

const initChatList: IMessage[] = [
  {
    text: "Выберите язык / Choose language",
    type: "assistant",
    id: nextId(),
    options: [
      {
        text: "Английский / English",
        type: "option",
        id: 2,
        lang: chatMessageTypes.EN,
      },
      {
        text: "Русский / Russian",
        type: "option",
        id: 2,
        lang: chatMessageTypes.RU,
      },
    ],
  },
];

const startOverChat: IMessage = {
  id: nextId(),
  text: "Start over",
  type: "option",
  action: chatMessageTypes.START_OVER_CHAT,
};

const activateAssistant: IMessage = {
  id: nextId(),
  text: "Activate assistant",
  type: "option",
  action: chatMessageTypes.ACTIVATE_ASSISTANT,
};

export { initChatList, startOverChat, activateAssistant };
