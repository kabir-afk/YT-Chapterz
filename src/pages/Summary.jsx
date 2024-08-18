/*global chrome */
import React, { useState, useEffect } from "react";
import {
  Button,
  useClipboard,
  Progress,
  Accordion,
  IconButton,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeTranscript } from "youtube-transcript";
import { generateKey } from "../keyGenerator";
import Chapter from "./Chapter";
import CopyBtn from "./CopyBtn";

const Summary = () => {
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummary, setIsSummary] = useState([]);
  let { value, setValue} = useClipboard("");

  async function summarizeTranscript(transcript) {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyA8lp_XBJQ2ZqecZLmyZD5iKAjR_bvv0yc"
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
    const processedTranscript = transcript.map((obj) => {
      const hrs = Math.floor(obj.offset / 3600);
      const mins = Math.floor((obj.offset % 3600) / 60);
      const secs = Math.floor(obj.offset % 60);

      // Format hours, minutes, and seconds
      const formattedSecs = secs.toString().padStart(2, "0");
      const formattedMins = mins.toString().padStart(2, "0");
      const formattedHrs = hrs.toString().padStart(2, "0");

      // Return formatted string
      if (hrs > 0) {
        return `${obj.text} - ${formattedHrs}:${formattedMins}:${formattedSecs}`;
      } else {
        return `${obj.text} - ${formattedMins}:${formattedSecs}`;
      }
    });
    console.log(processedTranscript);

    const prompt = `Summarize the transcript along with appropriate timestamps and headings : ${processedTranscript}.
    If the transcript contains some kind of sponsorship or ad then make sure to make a chapter for it as well , for viewers to skip.
    Make sure the points are concise, not longer than 35 words.
    Schema should look like this {
    [
        {
          "title": {type : string},
          "timestamp": {type : string},
          "points": {type : array} [point1 , point2]"
        }, 
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }

  async function summarizeActiveTab(url) {
    console.log("Tab updated : ", url);
    let transcript = await YoutubeTranscript.fetchTranscript(url);
    let summary = await summarizeTranscript(transcript);
    const array = JSON.parse(summary);
    console.log(array);
    return array;
  }

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
  function parseToCopyableValue(summary) {
    const copyableSummaryArray = summary.map((chapter) => {
      const { title, points } = chapter;
      const pointsString = points.map((point) => `  • ${point}`).join("\n");
      return `${title}\n${pointsString}\n`;
    });
    value = copyableSummaryArray.join("\n");
    setValue(value);
  }

  function insertSummary(summary) {
    const chapters = [];
    summary.forEach((chapter) => {
      const { title, points, timestamp } = chapter;
      chapters.push(
        <Chapter title={title} points={points} timestamp={timestamp}></Chapter>
      );
    });
    setIsSummary(chapters);
  }

  async function getSummary() {
    try {
      setIsLoading(true);
      let tab = await getCurrentTab();

      const summary = await summarizeActiveTab(tab.url);
      console.log(summary);

      const key = generateKey("summary", tab.url, tab.id);
      chrome.storage.local.set({ [key]: summary });

      insertSummary(summary);
      parseToCopyableValue(summary);
      setIsLoading(false);
      setIsFetched(true);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function fetchStoredSummary() {
      try {
        let tab = await getCurrentTab();
        const key = generateKey("summary", tab.url, tab.id);

        chrome.storage.local.get(key, (items) => {
          if (items[key]) {
            setIsFetched(true);
            insertSummary(items[key]);
            parseToCopyableValue(items[key]);
          } else {
            setIsSummary([]);
          }
        });
      } catch (error) {
        console.error("Error fetching stored summary:", error);
      }
    }

    fetchStoredSummary();
  });

  return (
    <>
      {!isFetched && <Button onClick={getSummary}>Summary</Button>}
      {isLoading && <Progress size="xs" isIndeterminate mt={3} />}
      {isFetched && (
        <Flex>
          <CopyBtn title={'Summary'} valueToBeCopied={value}/>
          <Spacer />
          <IconButton
            aria-label="Refresh Summary"
            icon={<RepeatIcon />}
            onClick={getSummary}
          />
        </Flex>
      )}
      <Accordion allowMultiple>{isSummary}</Accordion>
    </>
  );
};

export default Summary;
