import { HTMLAttributes, FC, Fragment, MouseEventHandler } from "react";
import styles from "./ChatList.module.scss";
import { IMessage } from "shared/types/chatWithAssistant";
import TypingEffect from "components/ui/typingEffect/TypingEffect";
import Loader from "components/ui/loader/Loader";
import { useTranslation } from "react-i18next";
import ChatCard from "components/screens/home/chatList/chatCard/ChatCard";

export interface IProps extends HTMLAttributes<HTMLElement> {
  chatList: IMessage[];
  loading: boolean;
  onOptionClick?: (option: IMessage) => any;
}

const ChatCardMessages: FC<IMessage> = ({ text, id, type }) => {
  const { t } = useTranslation();

  return text ? (
    <ChatCard key={id} className={type ?? ""}>
      <TypingEffect text={t(text)} duration={2} />
    </ChatCard>
  ) : null;
};

const ChatCardOptions: FC<{
  options: IMessage[];
  onOptionClick?: (option: IMessage) => any;
}> = ({ options, onOptionClick }) => {
  const { t } = useTranslation();

  return options?.length > 0 ? (
    <div className={styles.options}>
      {options.map((option: IMessage, index) => (
        <ChatCard
          className={option?.type ?? ""}
          key={index}
          onClick={() =>
            option?.id && onOptionClick ? onOptionClick(option) : undefined
          }
        >
          {t(option.text)}
        </ChatCard>
      ))}
    </div>
  ) : null;
};

const ChatList: FC<IProps> = ({
  chatList,
  loading,
  onOptionClick,
  ...rest
}) => {
  return (
    <div {...rest} className={styles.wrapper}>
      {chatList.map((message: IMessage, index) => (
        <Fragment key={index}>
          <ChatCardMessages {...message} />
          <ChatCardOptions
            options={message.options}
            onOptionClick={onOptionClick}
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
