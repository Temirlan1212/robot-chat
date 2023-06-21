import styles from "./SpeechRecognation.module.scss";
import { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useRef, FC, useState } from "react";
import cn from "classnames";
import SpeechRecognition from "react-speech-recognition";
import { handlePlay } from "utils/soundEffect";
import { PlayAssistant, StopAssistant } from "assets/soundEffects";
import { useOutsideClick } from "hooks/useOutsideClick";
import AudioRecordAnimation from "components/ui/audioRecordAnimation/audioRecordAnimation";
import TypingEffect from "components/ui/typingEffect/TypingEffect";

interface IProps {
  loading: boolean;
  updateList: any;
  uploadAudioText: any;
  className: string;
}

const SpeechRecognation: FC<IProps> = ({
  loading,
  updateList,
  uploadAudioText,
  className,
  ...rest
}) => {
  const {
    transcript,
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();
  const ref = useRef(null);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (finalTranscript) {
      updateList(transcript, "user");
      uploadAudioText(transcript);
      resetTranscript();
    }
  }, [finalTranscript]);

  useEffect(() => {
    if (!listening && isClicked) {
      handlePlay(StopAssistant);
    }
    if (listening && isClicked) {
      handlePlay(PlayAssistant);
    }
  }, [listening]);

  useEffect(() => {
    return () => handleRecordStop();
  }, []);

  const handleRecordPlay = () => {
    SpeechRecognition.startListening();
    setIsClicked(true);
  };

  const handleRecordStop = () => {
    SpeechRecognition.stopListening();
  };

  useOutsideClick(ref, () => {
    if (listening) handleRecordStop();
  });

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support Speech o Text</span>;
  }

  return (
    <div className={cn(styles.speechRecognation, className)} {...rest}>
      <div ref={ref}>
        {!listening ? (
          <AudioRecordAnimation
            width={60}
            height={60}
            className={loading ? "disable" : ""}
            onClick={handleRecordPlay}
            isRecording={listening}
          ></AudioRecordAnimation>
        ) : (
          <AudioRecordAnimation
            width={62}
            height={62}
            className={loading ? "disable" : ""}
            onClick={handleRecordStop}
            isRecording={listening}
          ></AudioRecordAnimation>
        )}
      </div>

      {transcript ? (
        <div className={styles["text-wrapper"]}>
          <TypingEffect text={transcript} duration={50} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SpeechRecognation;
