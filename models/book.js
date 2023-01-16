const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    numberInStock: { type: Number, required: true },
    pages: { type: Number, required: true },
    publisher: { type: Schema.Types.ObjectId, ref: "Publisher", required: true },
    isbn: { type: String, required: true },
    coverSize: { type: [Number] },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    publicationDate: { type: Date },
});

BookSchema.virtual("url").get(function () {
    return `/catalog/book/${this._id}`;
});

module.exports = mongoose.model("Book", BookSchema);