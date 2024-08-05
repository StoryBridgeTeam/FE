import { Checkbox } from "@chakra-ui/react";

const CheckboxStyled = ({ ...props }) => {
  return (
    <Checkbox
      isChecked={props.isChecked}
      onChange={props.onChange}
      w="full"
      size="lg"
      sx={{
        "& .chakra-checkbox__control": {
          borderRadius: "full",
          bg: "white",
          borderColor: "gray.400",
          color: "white",
          "&[data-checked]": {
            bg: "gray.600",
            borderColor: "gray.600",
          },
        },
      }}
    >
      {props.children}
    </Checkbox>
  );
};

export default CheckboxStyled;
