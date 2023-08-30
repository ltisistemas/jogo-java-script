import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import path from "path";

const baseUrl = path.resolve("src", "public");

const app = express();

app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/static", express.static(baseUrl));

app.use("/js", express.static(baseUrl.concat('/js')));
app.use("/css", express.static(baseUrl.concat('/css')));

app.get("/", (req, res) => res.sendFile(baseUrl.concat("/index.html")));

const server = http.createServer(app);
const p = 4200;
server.listen(p).on("listening", () => {
  console.log(`Yeah! Server is up on Port: ${p}! Processo: ${process.pid}`);
});
