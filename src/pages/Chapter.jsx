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
        <Button size="lg" colorScheme="green" mt="24px">
          {timestamp}
        </Button>
      </Box>
    </>
  );
};

export default Chapter;
