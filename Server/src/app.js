import express from "express";
import body_parser from "body-parser";
import signalRouter from "./signalRoutes";

const app = express();

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

app.use('/', signalRouter);

export default app;