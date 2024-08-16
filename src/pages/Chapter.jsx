/*global chrome */
import React from "react";
import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
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
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left" fontWeight={600}>
              {title}
            </Box>
            <Button
              size="md"
              colorScheme="blue"
              onClick={() => jumpToTimestamp(timestamp)}
            >
              {timestamp}
            </Button>
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <UnorderedList>
            {points.map((point, index) => (
              <ListItem key={index}>{point}</ListItem>
            ))}
          </UnorderedList>
        </AccordionPanel>
      </AccordionItem>
    </>
  );
};

export default Chapter;
