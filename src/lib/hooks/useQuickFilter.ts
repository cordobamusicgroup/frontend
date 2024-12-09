import { useRef, useState } from "react";

const useQuickFilter = () => {
  const searchTextRef = useRef<HTMLInputElement | null>(null);
  const [quickFilterText, setQuickFilterText] = useState<string>("");

  const applyFilter = () => {
    setQuickFilterText(searchTextRef.current?.value || "");
  };

  const resetFilter = () => {
    if (searchTextRef.current) {
      searchTextRef.current.value = "";
    }
    setQuickFilterText("");
  };

  return {
    searchTextRef,
    quickFilterText,
    applyFilter,
    resetFilter,
  };
};

export default useQuickFilter;