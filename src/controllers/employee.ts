import Express from "express";
import Mongoose from "mongoose";
import Employee from "../models/Employee";

const router = Express.Router();
Mongoose.connect("mongodb://localhost/jobDB", { useNewUrlParser: true });
const db = Mongoose.connection;

db.on("connected", () => {
	console.log("connected to db");
});

router.get("/", (req, res) => {
	Employee.findOneAndUpdate({ id: 1 }, { first_name: "Jack", last_name: "Joe" }, { new: true }, (err, employee) => {
		res.send(employee);
		db.close();
	});
});

router.get("/new", (req, res) => {
	console.log(req.query);
	// res.json(req.query);
	let query = req.query;
	let main = { [query["main"]]: { $gt: query["$gt"] } };

	console.log(main);

	Employee.find(
		main,
		{ first_name: true, last_name: true, id: true, salary: true },
		{ limit: parseInt(req.query.limit) }
	)
		.sort([[query.sortBy, 1]])
		.exec((err, result) => {
			if (err) {
				res.send("An error occurred retreiving employees.");
				Mongoose.disconnect();
			}
			res.send(result);
			Mongoose.disconnect().then(() => {
				console.log("disconnected from db");
			});
		});
});
export default router;
