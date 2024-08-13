/*global chrome */
import React from "react";
import {
  Box,
  Button,
  Heading,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";

const Chapter = (props) => {
  const { title, points, timestamp } = props;
  function jumpToTimestamp(time) {
    const tsArray = time.split(":").map(Number);

    let videoTime;
    if (tsArray.length === 2) {
      const [minutes, seconds] = tsArray;
      videoTime = minutes * 60 + seconds;
    } else {
      const [hours, minutes, seconds] = tsArray;
      videoTime = hours * 60 + minutes * 60 + seconds;
    }
    // Execute script to navigate to the specific timestamp
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (videoTime) => {
          const video = document.querySelector("video");
          if (video) {
            video.currentTime = videoTime;
            video.play();
          }
        },
        args: [videoTime],
      });
    });
  }
  return (
    <>
      <Box maxW="32rem">
        <Heading as="h2" size="2xl" noOfLines={1}>
          {title}
        </Heading>
        <UnorderedList>
          {points.map((point, index) => (
            <ListItem key={index}>{point}</ListItem>
          ))}
        </UnorderedList>
        <Button
          size="lg"
          colorScheme="green"
          mt="24px"
          onClick={() => jumpToTimestamp(timestamp)}
        >
          {timestamp}
        </Button>
      </Box>
    </>
  );
};

export default Chapter;
