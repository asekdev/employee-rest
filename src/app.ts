import express from "express";
import employeeRoute from "./controllers/employee";

const app = express();

app.use("/api/employees", employeeRoute);

app.listen(3000, () => {
	console.log("listening on port 3000");
});
