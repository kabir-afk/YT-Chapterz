import { CopyIcon } from "@chakra-ui/icons";
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
        status: "success",
        position: "top",
        duration: 1000,
        isClosable: true,
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
