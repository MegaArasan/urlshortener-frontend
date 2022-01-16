import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

// Material UI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import { InputAdornment, Tooltip } from "@mui/material";
import { forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export function Dashboard({ setName }) {
  // Snackbar
  const [Message, setMessage] = useState(""); // Server Message
  const [open, setOpen] = useState(false); // Snackbar Open/close status

  // Snackbar Open
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Username
  // const { setName, token } = useContext(context);
  const [count, setCount] = useState(false); // Conditional rendering for Custom Url text field
  const [responseData, setResponseData] = useState(null); // server Response
  const [shortUrl, setShortUrl] = useState(""); // Short Url

  // Validation
  let validation = yup.object({
    url: yup.string().required("Required Field"),
    customUrl: yup
      .string()
      .matches(/^[A-Za-z0-9 ]+$/, "Special Characters Not Allowed")
      .min(5, "Minimum 5 Characters Required"),
  });
  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: { url: "", customUrl: "" },
      validationSchema: validation,
      onSubmit: (urlData) => {
        callDB(urlData);
        // console.log(urlData);
      }, // Arrow Function
    });

  // Tooltip
  const [text, setText] = useState("Copy"); // URL Copy
  const copy = () => {
    setTimeout(() => {
      setText("Copy");
    }, 1000);
  };

  const token = localStorage.getItem("token");
  const getData = () => {
    fetch(`http://localhost:2000/users/getdata`, {
      method: "GET",
      headers: { "x-auth-token": token },
    })
      .then((responsebody) => responsebody.json())
      .then((data) => {
        // console.log(data);
        setResponseData(data);
      });
  };

  // eslint-disable-next-line
  useEffect(getData, []);

  // To create Short URL
  const getUrl = (userData) => {
    fetch(`http://localhost:2000/url`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((x) => {
        // console.log(x);
        setShortUrl(x.shortUrl);
        setMessage({ msg: x.Msg, result: "success" });
      })
      .catch((error) => setMessage({ msg: error.Msg, result: "error" }))
      .then(handleClick);
  };
  // Both Success & Error messages are passed to snack bar for user notification

  // On create this function is called
  const callDB = (urlData) => {
    if (responseData) {
      const { email } = responseData;
      const { url, customUrl } = urlData;
      // console.log(email, url, customUrl);
      getUrl({ email, url, customUrl });
    }
  };

  // Username in App bar
  const Username = localStorage.getItem("Username");
  setName(() => (responseData ? responseData.Username : Username));

  return (
    <div className="dashboard">
      <form onSubmit={handleSubmit}>
        {/* Long URL & Create Button */}
        <TextField
          type="text"
          variant="outlined"
          label="Paste The URL"
          name="url"
          id="url"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.url && touched.url}
          value={values.url}
          className="urlbox1"
          placeholder="Paste the URL"
          helperText={errors.url && touched.url && errors.url}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ height: "3rem", margin: "5px" }}
          color="primary"
        >
          Create
        </Button>
      </form>
      <br />
      {count && (
        <>
          <TextField
            type="text"
            label="Custom URL"
            className="urlbox2"
            placeholder="Custom URL"
            name="customUrl"
            id="customUrl"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.customUrl && touched.customUrl}
            value={values.customUrl}
            helperText={
              errors.customUrl && touched.customUrl && errors.customUrl
            }
          />
          <br />
        </>
      )}
      {/* Short URL */}
      <TextField
        variant="outlined"
        label="Short Url"
        color="warning"
        className="urlbox2"
        type="text"
        value={shortUrl}
        readOnly
        placeholder="Short Url"
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <Tooltip title={text}>
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl);
                    setText((text) => text === "Copy" && "Copied");
                    copy();
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      <br />
      <Button
        type="submit"
        onClick={() => {
          setShortUrl("");
        }}
      >
        Clear Data
      </Button>{" "}
      {/* To Clear Short URL Data */}
      <Button sx={{ ml: "16px" }} onClick={() => setCount((count) => !count)}>
        Create Custom URL
      </Button>
      {/* Snack Bar */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Alert severity={Message.result} sx={{ width: "100%" }}>
            {Message.msg}
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
