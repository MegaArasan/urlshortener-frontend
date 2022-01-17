import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Link } from "@mui/material";
import { API_URL } from "../globalconstant.js";

export function Userdata() {
  const history = useHistory();
  //   const shortURL = `http://localhost:2000`;
  const [Message, setMessage] = useState(""); // Server Message
  // Snack Bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack Bar Open/Close function
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState([]); // To get server data
  // const linkstyle = { color: mode === "light" && "#1976d2" }; // URL Styles

  const getData = () => {
    fetch(`${API_URL}/users/userdata`, {
      method: "GET",
      headers: { "x-auth-token": token },
    })
      .then((data) => data.json())
      .then((urls) => {
        // console.log(urls);
        setUserData(urls);
      }); // To get url data
  };
  useEffect(getData, [token]);

  // URL Delete
  const remove = (_id) => {
    fetch(`${API_URL}/deleteurl/${_id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => setMessage({ msg: data.Msg, result: "success" }))
      .catch((error) => setMessage({ msg: error.Msg, result: "error" }))
      .then(() => getData())
      .then(handleClick);
  };
  return (
    <div>
      <div className="urlcount">
        <Typography variant="h4" textAlign="center">
          URLS : {userData.length}
        </Typography>
      </div>
      {/* URL Count */}
      <div className="urlpage">
        {userData.length === 0 ? (
          <div>
            <CircularProgress id="dataprogress"></CircularProgress>
          </div>
        ) : (
          userData.map(
            ({
              longUrl,
              shortUrl,
              _id,
              createdAt,
              usedCount,
              shortString,
              lastUpdated,
            }) => {
              return (
                <Card
                  sx={{
                    maxWidth: 245,
                    padding: "10px",
                    maxHeight: 330,
                    margin: "1rem",
                  }}
                  key={_id}
                >
                  <Typography variant="h4">{shortString}</Typography>
                  <CardContent>
                    <Typography variant="h6">URL</Typography>
                    <Link
                      sx={{ wordWrap: "break-word" }}
                      href={longUrl}
                      variant="p"
                      target="_blank"
                      rel="noopener"
                      color="inherit"
                      underline="hover"
                    >
                      {longUrl}
                    </Link>
                    <Typography variant="h6">Short URL</Typography>
                    <Link
                      sx={{ wordWrap: "break-word" }}
                      href={shortUrl}
                      variant="p"
                      target="_blank"
                      rel="noopener"
                      color="inherit"
                      underline="hover"
                    >
                      {shortUrl}
                    </Link>
                    <Info
                      createdAt={createdAt}
                      usedCount={usedCount}
                      deleteUrl={
                        <Tooltip title="Delete">
                          <IconButton onClick={() => remove(_id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      }
                      editUrl={
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => history.push(`/updatedata/${_id}`)}
                          >
                            <EditIcon color="success" />
                          </IconButton>
                        </Tooltip>
                      }
                      shortUrl={shortUrl}
                      lastUpdated={lastUpdated}
                    />
                  </CardContent>
                </Card>
              );
            }
          )
        )}

        {/* Snack Bar */}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
          >
            <Alert severity={Message.result} sx={{ width: "100%" }}>
              {Message.msg}
            </Alert>
          </Snackbar>
        </Stack>
      </div>
    </div>
  );
}

// URL Details
function Info({ lastUpdated, usedCount, deleteUrl, shortUrl, editUrl }) {
  //  Accordian
  const [showinfo, setShowinfo] = useState("hide");
  const icon =
    showinfo === "hide" ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />;

  // Tooltip
  const [text, setText] = useState("Copy Short URL");
  const copy = () => {
    setTimeout(() => {
      setText("Copy Short URL");
    }, 1000);
  };
  return (
    <div style={{ margin: "5px" }}>
      <IconButton
        className="info"
        onClick={() =>
          setShowinfo((showinfo) => (showinfo === "hide" ? "show" : "hide"))
        }
      >
        {icon}
      </IconButton>
      {deleteUrl}
      {editUrl} {/* Show/Hide Button,Delete Button,Edit Button */}
      <IconButton
        onClick={() => {
          navigator.clipboard.writeText(shortUrl);
          setText(() => text === "Copy Short URL" && "Copied");
          copy();
        }}
      >
        <Tooltip title={text}>
          <ContentCopyIcon />
        </Tooltip>
      </IconButton>
      {showinfo === "show" && (
        <div className="urldetails">
          <Typography variant="p">last Updated</Typography>
          <br />
          <Typography variant="p">{lastUpdated}</Typography>
          <br />
          <Typography variant="p">
            <b>Clicks:</b> {usedCount}
          </Typography>
        </div>
      )}
    </div>
  );
}
