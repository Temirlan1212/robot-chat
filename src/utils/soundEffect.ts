let audio: HTMLAudioElement | null = null;

export const handlePlaySound = (url: string) => {
  if (audio) {
    audio.pause();
  }

  audio = new Audio(url);
  audio.play().catch((e) => {
    console.log(e);
  });
};
