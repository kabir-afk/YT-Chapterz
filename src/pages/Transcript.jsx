/*global chrome */
import React, { useState, useEffect } from "react";
import { Button, Text, useClipboard , Progress} from "@chakra-ui/react";
import { YoutubeTranscript } from "youtube-transcript";
import { generateKey } from "../keyGenerator";
import CopyBtn from "./CopyBtn";

const Transcript = () => {
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {  value, setValue } = useClipboard('');
  
  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  async function getTranscript() {
    try {
      setIsLoading(true)
      let tab = await getCurrentTab();
      let transcript = await YoutubeTranscript.fetchTranscript(tab.url);
      let transcriptText = transcript.map(element => element.text).join(' ');

      const key = generateKey("transcript",tab.url, tab.id);
      chrome.storage.local.set({ [key]: transcriptText });

      setValue(transcriptText.replace('undefined', '').replace('&amp;#39;', "'"));
      setIsLoading(false);
      setIsFetched(true);
    } catch (error) {
      console.error('Error fetching transcript:', error);
    }
  }

  useEffect(() => {
    async function fetchStoredTranscript() {
      try {
        let tab = await getCurrentTab();
        const key = generateKey("transcript",tab.url, tab.id);
        chrome.storage.local.get(key, (items) => {
          if (items[key]) {
            setIsFetched(true);
            setValue(items[key].replace('undefined', '').replace('&amp;#39;', "'"));
          } else {
            setValue('');
          }
        });
      } catch (error) {
        console.error('Error fetching stored transcript:', error);
      }
    }

    fetchStoredTranscript();
  }, [setValue]);

  return (
    <>
      {!isFetched && <Button onClick={getTranscript}>Transcript</Button>}
      {isLoading && <Progress size='xs' isIndeterminate marginTop={3}/>}
      {isFetched && <CopyBtn title={'Transcript'} valueToBeCopied={value}/>}
      <Text>{value}</Text>
    </>
  );
};

export default Transcript;
