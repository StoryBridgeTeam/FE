import { Box, IconButton } from "@chakra-ui/react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import CheckboxStyled from "./CheckboxStyled";

interface TermItemProps {
  isChecked: boolean;
  hasDetail: boolean;
  onChange: () => void;
  children: string;
}

const TermItem = ({
  isChecked,
  onChange,
  hasDetail,
  children,
}: TermItemProps) => {
  return (
    <Box display="flex" alignItems="center">
      <CheckboxStyled isChecked={isChecked} onChange={onChange}>
        {children}
      </CheckboxStyled>
      {hasDetail && (
        <IconButton
          size="xs"
          ml="auto"
          aria-label="View Terms"
          icon={<MdOutlineArrowForwardIos />}
          variant="ghost"
        ></IconButton>
      )}
    </Box>
  );
};

export default TermItem;
