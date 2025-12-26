import React from "react";
import {
  Box,
  Pagination as MuiPagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSizeOptions = true,
}) {
  const handlePageChange = (event, value) => {
    onPageChange(value);
  };

  const handlePageSizeChange = (event) => {
    onPageSizeChange(event.target.value);
  };

  if (totalPages <= 1 && !showPageSizeOptions) {
    return null;
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mt: 4,
        p: 2,
        backgroundColor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondary">
          Показано {startItem}-{endItem} из {totalCount}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {showPageSizeOptions && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>На странице</InputLabel>
            <Select
              value={pageSize}
              label="На странице"
              onChange={handlePageSizeChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        )}

        {totalPages > 1 && (
          <MuiPagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="medium"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        )}
      </Box>
    </Box>
  );
}