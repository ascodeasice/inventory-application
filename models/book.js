const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    numberInStock: { type: Number, required: true },
    pages: { type: Number, required: true },
    publisher: { type: Schema.Types.ObjectId, ref: "Publisher" },
    isbn: { type: String, required: true },
    coverSize: { type: [Number], required: true },
});

BookSchema.virtual("url").get(function () {
    return `/book/${this._id}`;
});

module.exports = mongoose.model("Category", BookSchema);