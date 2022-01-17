import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { API_URL } from "../globalconstant.js";

export function Update() {
  const { id } = useParams(); // ObjectId of individual URL
  // To store individual URL
  const [data, setData] = useState(null);

  const getData = () => {
    // Getting URL by ID
    fetch(`${API_URL}/geturl/${id}`, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setData(data);
      });
  };
  useEffect(getData, [id]);

  // Loading Status on condional rendering
  // renders if the data is empty
  return data === null ? (
    <CircularProgress id="editprogress"></CircularProgress>
  ) : (
    <div>
      <UpdateURL data={data} />
    </div>
  );
}

// Component rendered based on condition if the data is not empty

function UpdateURL({ data }) {
  const history = useHistory();

  const { longUrl, shortString, _id, lastUpdated } = data; // Destructuring

  // Snackbar
  const [Message, setMessage] = useState(""); // Server Message
  const [open, setOpen] = useState(false); // Snackbar open/close status
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snackbar open/close function
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const Update = (url) => {
    fetch(`${API_URL}/editurl`, {
      method: "PUT",
      body: JSON.stringify(url),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => response)
      .then((data) => {
        // console.log(data.status);
        if (data.status === 200) {
          setMessage({ msg: "Url updated successfully", result: "success" });
        } else {
          setMessage({ msg: data.json().Msg, result: "error" });
        }
      })
      .then(handleClick);
  };

  // URL update status- if url is successfully update the page will be redirected to url page after 2 Seconds
  if (Message.result === "success") {
    setTimeout(() => {
      history.push("/userdata");
    }, 2000);
  }

  // Validation
  let validation = yup.object({
    customUrl: yup
      .string()
      .matches(/^[A-Za-z0-9 ]+$/, "Special Characters Not Allowed")
      .min(5, "Minimum 5 Characters Required")
      .required("Required Field"),
  });

  const { handleBlur, handleSubmit, handleChange, touched, errors, values } =
    useFormik({
      initialValues: { customUrl: shortString, _id, lastUpdated },
      validationSchema: validation,
      onSubmit: (url) => {
        // console.log(url);
        Update(url);
      },
    });

  return (
    <div className="editdashboard">
      <form onSubmit={handleSubmit}>
        {/* Long URL Read Only */}
        <TextField
          sx={{ margin: "10px" }}
          type="text"
          variant="outlined"
          label="Update URL"
          name="url"
          id="url"
          readOnly
          className="editlongurl"
          value={longUrl}
          placeholder="Update URL"
          fullWidth
        />
        {/* Custom URL */}
        <TextField
          sx={{ margin: "10px" }}
          type="text"
          label="Custom URL"
          className="editcustomurl"
          placeholder="Custom URL"
          name="customUrl"
          id="customUrl"
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.customUrl && touched.customUrl}
          value={values.customUrl}
          helperText={errors.customUrl && touched.customUrl && errors.customUrl}
          fullWidth
        />
        {/* Save Button */}
        <Button
          sx={{ width: "35%", margin: "7px" }}
          type="submit"
          variant="contained"
          color="success"
        >
          Save
        </Button>
        <Button
          sx={{ width: "35%", marginLeft: "auto" }}
          type="submit"
          variant="contained"
          color="info"
          onClick={() => history.push("/userdata")}
        >
          Cancel
        </Button>
      </form>
      {/* Cancel */}

      {/* Snack Bar */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert severity={Message.result} sx={{ width: "100%" }}>
            {Message.msg}
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
}
