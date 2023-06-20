import { HTMLAttributes, FC } from "react";
import ChatCard from "./chatCard/ChatCard";
import styles from "./ChatList.module.scss";
import { IMessage } from "shared/types/chatWithAssistant";
import TypingEffect from "components/ui/typingEffect/TypingEffect";
import Loader from "components/ui/loader/Loader";

export interface IProps extends HTMLAttributes<HTMLElement> {
  chatList: IMessage[];
  loading: boolean;
}

const ChatList: FC<IProps> = ({ chatList, loading, ...rest }) => {
  return (
    <div {...rest} className={styles.wrapper}>
      {chatList.map((message: IMessage) => {
        return message?.text ? (
          <ChatCard key={message.id} className={message?.type ?? ""}>
            <TypingEffect text={message.text} duration={2} />
          </ChatCard>
        ) : (
          <></>
        );
      })}

      {loading ? (
        <ChatCard className={"assistant"}>
          <Loader loading={true} />
        </ChatCard>
      ) : (
        ""
      )}
    </div>
  );
};

export default ChatList;
