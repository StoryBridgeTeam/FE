import React, { useState, useRef, useEffect } from "react";
import { InputGroup, InputLeftElement, Input, Box } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import useSearch from "../../hooks/useSearch";
import SearchResults from "./SearchResults";

interface SearchBarProps {
  isShowSearch: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isShowSearch }) => {
  const { keyword, content, handleKeywordChange, setObserver } = useSearch();
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleKeywordChange(e);
    setIsResultsVisible(true);
  };

  const handleInputFocus = () => {
    if (keyword) {
      setIsResultsVisible(true);
    }
  };

  const handleCloseResults = () => {
    setIsResultsVisible(false);
  };

  return (
    <Box
      position="relative"
      ref={searchRef}
      display="flex"
      justifyContent="center"
      width="40%"
    >
      {isShowSearch && (
        <InputGroup w="100%">
          <InputLeftElement
            height="100%"
            display="flex"
            alignItems="center"
            pointerEvents="none"
          >
            <Box as={FaSearch} color="gray.600" />
          </InputLeftElement>
          <Input
            size="sm"
            bg="white"
            border="2px"
            borderColor="#CDCDCD"
            w="full"
            borderRadius="3xl"
            value={keyword}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </InputGroup>
      )}

      {isResultsVisible && keyword && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          mt={2}
          bg="white"
          boxShadow="md"
          borderRadius="md"
          zIndex={1000}
          w="100%"
        >
          <SearchResults
            content={content}
            setObserver={setObserver}
            onClose={handleCloseResults}
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
