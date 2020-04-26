import express from "express";
import body_parser from "body-parser";

const app = express();

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

export default app;