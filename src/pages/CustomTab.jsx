import { Tab } from "@chakra-ui/react";
import React from "react";

const CustomTab = (props) => {
  return (
    <Tab
      sx={{
        fontWeight: "600",
        _hover: {
          color: "white",
          bgColor: "blue.400",
        },
      }}
    >
      {props.tabName}
    </Tab>
  );
};

export default CustomTab;
