import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useHistory } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export function Navbar({ mode, setMode, Name }) {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" id="nav">
        <Toolbar variant="dense">
          <Button
            color="inherit"
            onClick={() => {
              history.push("/Dashboard");
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              history.push("/userdata");
            }}
          >
            Url
          </Button>
          {/* Avatar */}

          <IconButton
            sx={{ marginLeft: "auto" }}
            className="avatar"
            onClick={handleClick}
          >
            <AccountCircleIcon style={{ fill: "white" }} />
          </IconButton>
          {/* Popup Menu */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ "aria-labelledby": "basic-button" }}
          >
            <MenuItem>
              <Typography>
                {Name ? Name : localStorage.getItem("Username")}
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                localStorage.clear();
                window.location.reload(false);
                window.location.href = "/";
              }}
            >
              Log Out
            </MenuItem>
          </Menu>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === "light" ? (
              <Tooltip title="Light Mode">
                <LightModeIcon style={{ fill: "gold" }} />
              </Tooltip>
            ) : (
              <Tooltip title="Dark Mode">
                <DarkModeIcon style={{ fill: "white" }} />
              </Tooltip>
            )}
          </IconButton>
          <Typography
            sx={{ display: { xs: "none", sm: "block", md: "block" } }}
            variant="p"
            color="inherit"
          >
            {mode === "light" ? "Light Mode" : "Dark Mode"}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
