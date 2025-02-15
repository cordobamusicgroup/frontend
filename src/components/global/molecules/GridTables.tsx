import React, { forwardRef } from "react";
import { themeQuartz } from "@ag-grid-community/theming";
import LoadingSpinner from "@/components/global/atoms/LoadingSpinner";
import { AgGridReact, AgGridReactProps } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { cmgThemeGrid } from "@/styles/grid-royalties";
import { Box } from "@mui/material";

interface GridTablesProps extends AgGridReactProps {
  columns: any[];
  rowData: any[];
  height?: string;
  width?: string;
}

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const GridTables = forwardRef<AgGridReact, GridTablesProps>(({ columns, rowData, height = "500px", width = "100%", ...props }, ref) => {
  return (
    <Box width={width} height={height}>
      <AgGridReact
        ref={ref}
        loadThemeGoogleFonts={true}
        theme={cmgThemeGrid}
        columnDefs={columns}
        rowData={rowData}
        loadingOverlayComponent={LoadingSpinner}
        loadingOverlayComponentParams={{ size: 30 }}
        suppressMovableColumns={true}
        pagination={true}
        paginationPageSize={20}
        suppressCellFocus
        enableCellTextSelection
        {...props} // Props adicionales pasan directamente a AgGridReact
      />
    </Box>
  );
});

export default GridTables;
