import { Schema, model, connect } from "mongoose";

let db=null;

const RatingsSchema = new Schema(
  { RatingsName: String },
  { timestamps: true }
);
const RatingsModel = model("Ratings", RatingsSchema, "Bookstore");

export const init = async () => {
  if(!db) {
    db = await connect(process.env["CosmosDbConnectionString"]);
  }
};
export const addItem = async (doc) => {
  const modelToInsert = new RatingsModel();
  modelToInsert["RatingsName"] = doc.name;

  return await modelToInsert.save();
};
export const findItemById = async (id) => {
  return await RatingsModel.findById(id);
};
export const findItems = async (query = {}) => {
  return await RatingsModel.find({});
};
export const deleteItemById = async (id) => {
  return await RatingsModel.findByIdAndDelete(id);
};