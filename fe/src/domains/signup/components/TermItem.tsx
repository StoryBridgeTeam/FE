import {Box, IconButton, Link} from "@chakra-ui/react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import CheckboxStyled from "./CheckboxStyled";

interface TermItemProps {
  isChecked: boolean;
  onChange: () => void;
  hasDetail : boolean,
    title:string,
  detailPath?:string
}

const TermItem = ({
  isChecked,
  onChange,
  hasDetail,
    title,
    detailPath
}: TermItemProps) => {
  return (
    <Box display="flex" alignItems="center">
      <CheckboxStyled isChecked={isChecked} onChange={onChange}>
        {title}
      </CheckboxStyled>
        {
            hasDetail && detailPath &&
            <Link href={detailPath} isExternal>
              <IconButton aria-label={"detail"} bgColor={"white"}>
                <MdOutlineArrowForwardIos />
              </IconButton>
            </Link>
        }
    </Box>
  );
};

export default TermItem;
