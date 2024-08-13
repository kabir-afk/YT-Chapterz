/*global chrome */
import React, { useState, useEffect } from "react";
import { Button, Text, useClipboard, Progress } from "@chakra-ui/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeTranscript } from "youtube-transcript";
import { generateKey } from "../keyGenerator";
import Chapter from "./Chapter";
// import { Chapter } from "./Chapter";

const Summary = () => {
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummary, setIsSummary] = useState([]);
  // const { onCopy, value, setValue, hasCopied } = useClipboard("");
  const { onCopy, hasCopied } = useClipboard("");

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

  async function getSummary() {
    try {
      setIsLoading(true);
      let tab = await getCurrentTab();

      // Await the result of summarizeActiveTab to ensure it's resolved
      const summary = await summarizeActiveTab(tab.url);
      console.log(summary);

      const key = generateKey("summary", tab.url, tab.id);
      chrome.storage.local.set({ [key]: summary });

      // After the summary is resolved, set the value in the state
      const chapters = [];
      summary.forEach((chapter) => {
        const { title, points, timestamp } = chapter;
        chapters.push(
          <Chapter
            title={title}
            points={points}
            timestamp={timestamp}
          ></Chapter>
        );
      });
      setIsSummary(chapters);
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
        console.log(key);

        chrome.storage.local.get(key, (items) => {
          if (items[key]) {
            setIsFetched(true);
            const chapters = [];
            items[key].forEach((chapter) => {
              const { title, points, timestamp } = chapter;
              chapters.push(
                <Chapter
                  title={title}
                  points={points}
                  timestamp={timestamp}
                ></Chapter>
              );
            });
            setIsSummary(chapters);
          } else {
            setIsSummary([]);
          }
        });
      } catch (error) {
        console.error("Error fetching stored summary:", error);
      }
    }

    fetchStoredSummary();
  }, []);

  return (
    <>
      {!isFetched && <Button onClick={getSummary}>Summary</Button>}
      {isLoading && <Progress size="xs" isIndeterminate />}
      {isFetched && (
        <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button>
      )}
      <Text>{isSummary}</Text>
    </>
  );
};

export default Summary;
