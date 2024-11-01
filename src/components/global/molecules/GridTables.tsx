import React, { forwardRef } from "react";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "@styles/grid-cmg.css";
import LoadingSpinner from "@/components/global/atoms/LoadingSpinner";

interface GridTablesProps extends AgGridReactProps {
  columns: any[];
  rowData: any[];
}

const GridTables = forwardRef<AgGridReact, GridTablesProps>(({ columns, rowData, ...props }, ref) => {
  return (
    <div className="ag-grid-theme-builder" style={{ height: "600px", width: "100%" }}>
      <AgGridReact
        ref={ref}
        columnDefs={columns}
        rowData={rowData}
        rowSelection={{ mode: "multiRow" }}
        loadingOverlayComponent={LoadingSpinner}
        loadingOverlayComponentParams={{ size: 30  }}
        suppressMovableColumns={true}
        pagination={true}
        paginationPageSize={20}
        {...props} // Props adicionales pasan directamente a AgGridReact
      />
    </div>
  );
});

export default GridTables;
