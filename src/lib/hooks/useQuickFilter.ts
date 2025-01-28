import { useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";

const useQuickFilter = (gridRef: React.RefObject<AgGridReact>) => {
  const searchTextRef = useRef<HTMLInputElement>(null);
  const [quickFilterText, setQuickFilterText] = useState("");

  const applyFilter = () => {
    const filterText = searchTextRef.current?.value || "";
    setQuickFilterText(filterText);
    gridRef.current?.api.setGridOption("quickFilterText", filterText);
  };

  const resetFilter = () => {
    setQuickFilterText("");
    if (searchTextRef.current) {
      searchTextRef
.current.value = "";
    }
    gridRef.current?.api.setGridOption("quickFilterText", "");
  };

  return { searchTextRef, quickFilterText, applyFilter, resetFilter };
};

export default useQuickFilter;