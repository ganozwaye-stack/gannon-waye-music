interface Window {
  webkitAudioContext?: typeof AudioContext;
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

declare namespace React {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
