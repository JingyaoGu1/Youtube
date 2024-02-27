import { Stack } from "@mui/material";
import { Link } from "react-router-dom";
import youtubeLogo from '../youtube.png';

import { SearchBar } from "./";

const Navbar = () => (
  <Stack direction="row" alignItems="center" p={2} sx={{ position:  "sticky", background: 'white', top: 0, justifyContent: "space-between" }}>
    <Link to="/" style={{ display: "flex", alignItems: "center" }}>
      <img src={youtubeLogo} alt="logo" height={25} />
    </Link>
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <SearchBar />
    </div>
  </Stack>
);

export default Navbar;


