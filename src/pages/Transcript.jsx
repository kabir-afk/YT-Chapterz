/*global chrome */
import React,{useState} from "react";
import { Button, Text , useClipboard } from "@chakra-ui/react";
import { YoutubeTranscript } from "youtube-transcript";

const Transcript = () => {

  const [isFetched,setIsFetched] = useState(false);
  const { onCopy, value, setValue, hasCopied } = useClipboard('');

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
  async function getTranscript() {
    let tab = await getCurrentTab();
    
    let transcript = await YoutubeTranscript.fetchTranscript(tab.url);
    let transcriptText;
    transcript.forEach(element => {
      transcriptText += element.text;
    });
    setValue(transcriptText.replace('undefined','').replace('&amp;#39;',"'"));
    setIsFetched(true);
  }
  return (
    <>
      {!isFetched && <Button onClick={getTranscript}>Transcript</Button>} {isFetched && <Button onClick={onCopy}>{hasCopied ? 'Copied!' : 'Copy'}</Button>}
      <Text>{value}</Text>
    </>
  );
};

export default Transcript;
