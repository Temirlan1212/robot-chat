import { HTMLAttributes, FC, Fragment, MouseEventHandler } from "react";
import styles from "./ChatList.module.scss";
import { IMessage } from "shared/types/chatWithAssistant";
import TypingEffect from "components/ui/typingEffect/TypingEffect";
import Loader from "components/ui/loader/Loader";
import ChatCard from "./chatCard/ChatCard";

export interface IProps extends HTMLAttributes<HTMLElement> {
  chatList: IMessage[];
  loading: boolean;
  onItemClick?: (id: number) => any;
}

const ChatCardMessages: FC<IMessage> = ({ text, id, type, options }) => {
  return text ? (
    <ChatCard key={id} className={type ?? ""}>
      <TypingEffect text={text} duration={2} />
    </ChatCard>
  ) : null;
};

const ChatCardOptions: FC<{
  options: any;
  onItemClick?: (id: number) => any;
}> = ({ options, onItemClick }) => {
  return options?.length > 0 ? (
    <div className={styles.options}>
      {options.map((option: any) => (
        <ChatCard
          className={option?.type ?? ""}
          key={option.id}
          onClick={() =>
            option?.id && onItemClick ? onItemClick(option.id) : undefined
          }
        >
          <TypingEffect text={option.text} duration={2} key={option.id} />
        </ChatCard>
      ))}
    </div>
  ) : null;
};

const ChatList: FC<IProps> = ({ chatList, loading, onItemClick, ...rest }) => {
  return (
    <div {...rest} className={styles.wrapper}>
      {chatList.map((message: IMessage) => (
        <Fragment key={message.id}>
          <ChatCardMessages {...message} />
          <ChatCardOptions
            options={message.options}
            onItemClick={onItemClick}
          />
        </Fragment>
      ))}

      {loading && (
        <ChatCard className="assistant">
          <Loader loading={true} />
        </ChatCard>
      )}
    </div>
  );
};

export default ChatList;
