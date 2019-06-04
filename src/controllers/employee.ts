import Express, { Request, Response } from "express";
import mongoose from "mongoose";
import Employee from "../models/Employee";

const router = Express.Router();

const db = mongoose.connection;

const connect = () => {
	mongoose.connect("mongodb://user:123@localhost/jobDB", { useNewUrlParser: true }).then(
		() => {
			console.log("Connected to the db!!!");
		},
		err => {
			console.log(err);
		}
	);
};

db.on("connected", () => {
	console.log("connected to db");
});

router.get("/single/:id", (req: Request, res: Response) => {
	connect();
	Employee.findOne({ _id: req.params.id }).exec((err, result) => {
		if (err) {
			res.send("An error occurred retreiving employees.");
			mongoose.disconnect().then(() => {
				console.log("disconnected from db error");
			});
		}
		res.send(result);
		mongoose.disconnect().then(() => {
			console.log("disconnected from db");
		});
	});
});

router.get("/search", (req: Request, res: Response) => {
	connect();
	let query = req.query;
	let regex = new RegExp(query.input);

	console.log(regex);

	Employee.aggregate([
		{ $project: { name: { $concat: ["$first_name", " ", "$last_name"] } } },
		{ $match: { name: { $regex: regex, $options: "i" } } }
	])
		.limit(5)
		.exec((err, result) => {
			if (err) {
				res.send("An error occurred retreiving employees.");
				mongoose.disconnect().then(() => {
					console.log("disconnected from db error");
				});
			}
			res.send(result);
			mongoose.disconnect().then(() => {
				console.log("disconnected from db");
			});
		});
});

router.get("/all", (req: Request, res: Response) => {
	connect();
	let query = req.query;
	let options = { limit: 25 };
	let condition = {};
	let aggregation = {};

	if (query.hasOwnProperty("limit")) {
		options.limit = parseInt(query["limit"]);
	}

	if (query.hasOwnProperty("cond") && (query.hasOwnProperty("condGt") || query.hasOwnProperty("condLt"))) {
		if (query.hasOwnProperty("condGt")) {
			Object.assign(aggregation, { $gt: parseInt(query["condGt"]) });
		} else if (query.hasOwnProperty("condLt")) {
			Object.assign(aggregation, { $lt: parseInt(query["condLt"]) });
		}
		let condValue = query["cond"];
		condition = { [condValue]: aggregation };
	}
	console.log(condition);

	Employee.find(condition, {}, options)
		.sort([[query.sortBy, query.sortType]])
		.exec((err, result) => {
			if (err) {
				res.send("An error occurred retreiving employees.");
				mongoose.disconnect().then(() => {
					console.log("disconnected from db error");
				});
			}
			res.send(result);
			mongoose.disconnect().then(() => {
				console.log("disconnected from db");
			});
		});
});
export default router;
