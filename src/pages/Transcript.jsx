/*global chrome */
import React, { useState, useEffect } from "react";
import { Button, Text, useClipboard } from "@chakra-ui/react";
import { YoutubeTranscript } from "youtube-transcript";
import { generateKey } from "../keyGenerator";

const Transcript = () => {
  const [isFetched, setIsFetched] = useState(false);
  const { onCopy, value, setValue, hasCopied } = useClipboard('');
  
  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  async function getTranscript() {
    try {
      let tab = await getCurrentTab();
      let transcript = await YoutubeTranscript.fetchTranscript(tab.url);
      let transcriptText = transcript.map(element => element.text).join(' ');

      const key = generateKey("transcript",tab.url, tab.id);
      chrome.storage.local.set({ [key]: transcriptText });

      setValue(transcriptText.replace('undefined', '').replace('&amp;#39;', "'"));
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
      {isFetched && <Button onClick={onCopy}>{hasCopied ? 'Copied!' : 'Copy'}</Button>}
      <Text>{value}</Text>
    </>
  );
};

export default Transcript;
