import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
	_id: ObjectId,
	id: Number,
	first_name: String,
	last_name: String,
	email: String,
	gender: String,
	salary: Number,
	job: String
});

export default mongoose.model("Employee", schema);
