import {  CheckCircleIcon, CopyIcon } from "@chakra-ui/icons";
import { IconButton, useClipboard, useToast } from "@chakra-ui/react";
import React from "react";

const CopyBtn = (props) => {
  const { title , valueToBeCopied} = props;
  const toast = useToast();
  const {onCopy, hasCopied } = useClipboard(valueToBeCopied);
  function customOnCopy() {
    onCopy();
    if (!hasCopied) {
      toast({
        title: `${title} copied`,
        position: "top",
        duration: 1000,
        isClosable: true,
        containerStyle: {
         backgroundColor : 'blue',
         borderRadius : '5px',
        },
        icon: <CheckCircleIcon color="white.500" boxSize={3} marginTop={2}/>,
      });
    }
  }
  return (
    <IconButton
      aria-label="Refresh Summary"
      icon={<CopyIcon />}
      onClick={customOnCopy}
      mb={4}
    />
  );
};

export default CopyBtn;
