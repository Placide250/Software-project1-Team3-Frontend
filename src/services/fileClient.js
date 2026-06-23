import axios from "axios";

let baseurl = "";

if (process.env.NODE_ENV === "development") {
  baseurl = "http://localhost:3200/planetapi/";
} else {
  baseurl = "/planetapi/";
}

const fileClient = axios.create({
  baseURL: baseurl,
});

export default fileClient;