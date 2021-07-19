const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const allRoutes = require("./routes/allRoutes");
const errorController = require("./controllers/errorController");

const app = express();

app.use(
	cors({
		origin: ["http://192.168.1.13:8080", "https://192.168.1.13:8080"],
		exposedHeaders: ["authorization", "set-cookie"],
		credentials: true,
	})
);
//app.options("*", cors());
app.use(helmet());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());

app.use("/api/v1", allRoutes);

app.use(errorController);

module.exports = app;
