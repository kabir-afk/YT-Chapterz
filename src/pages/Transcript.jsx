/*global chrome */
import React,{useState} from "react";
import { Button, Text } from "@chakra-ui/react";
import { YoutubeTranscript } from "youtube-transcript";

const Transcript = () => {

  const [transcriptString,setTranscriptString] = useState('');

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
    setTranscriptString(transcriptText);
  }
  return (
    <>
      <Button onClick={getTranscript}>Transcript</Button>
      <Text>{transcriptString}</Text>
    </>
  );
};

export default Transcript;
