//db connection
import mongoose from "mongoose";

async function main(){
	await mongoose.connect("mongodb+srv://yashshelke:Yash8855@real-estate-db.f9g4xuh.mongodb.net/test")
	.then(()=>console.log("Connected to mongodb atlas"))
	// .catch((err)=>console.log(err));
}
main().catch((err)=>console.log(err));


const {Schema} = mongoose;
const propertySchema = new Schema({
	accountId: String,
	image: String,
	type: String,
	price: Number,
	location: String,
	desc: String,
	contact: String
});
// id: {type:Number,unique:true},

// propertySchema.statics.generateId = async function() {
// 	// find the maximum ID value
// 	const maxProduct = await this.findOne().sort('-id');
// 	const maxId = maxProduct ? maxProduct.id : 0;
// 	return maxId + 1;
// };

const property = new mongoose.model("property", propertySchema);

export default property;


//inserting data

// const newProperty = new property({
// 	id: 20,
// 	image: "./temp/desk5.webp",
// 	type: "name",
// 	price: 7050,
// 	location: "jalgaon",
// 	desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
// 	contact: "yash@gmail.com",
// });
// newProperty.save()
// .then(()=>console.log("data inserted"))
// .catch(err=>console.log(err))