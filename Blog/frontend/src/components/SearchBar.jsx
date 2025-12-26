// import React, { useState } from "react";
// import { TextField, InputAdornment, IconButton } from "@mui/material";
// import { Search, Clear } from "@mui/icons-material";

// export default function SearchBar({ onSearch, placeholder = "Поиск по названию..." }) {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearch = (e) => {
//     if (e.key === "Enter" || e.type === "click") {
//       onSearch(searchTerm);
//     }
//   };

//   const handleClear = () => {
//     setSearchTerm("");
//     onSearch("");
//   };

//   return (
//     <TextField
//       placeholder={placeholder}
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//       onKeyPress={handleSearch}
//       sx={{ width: 300 }}
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             <IconButton onClick={() => onSearch(searchTerm)}>
//               <Search />
//             </IconButton>
//           </InputAdornment>
//         ),
//         endAdornment: searchTerm && (
//           <InputAdornment position="end">
//             <IconButton onClick={handleClear} size="small">
//               <Clear />
//             </IconButton>
//           </InputAdornment>
//         ),
//       }}
//     />
//   );
// }
import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

export default function SearchBar({ onSearch, placeholder = "Поиск по названию..." }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearch, setHasSearch] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      onSearch(searchTerm);
      setHasSearch(!!searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setHasSearch(false);
    onSearch("");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <TextField
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleSearch}
        sx={{ width: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={() => handleSearch({ type: "click" })}>
                <Search />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      {hasSearch && (
        <Button
          variant="outlined"
          size="small"
          onClick={handleClear}
          startIcon={<Clear />}
        >
          Сбросить поиск
        </Button>
      )}
    </div>
  );
}