const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { DateTime } = require("luxon");

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

BookSchema.virtual("publication_date_formatted").get(function () {
    return this.publicationDate ?
        DateTime.fromJSDate(this.publicationDate).toLocaleString(DateTime.DATE_FULL)
        : "Unknown";
});

BookSchema.virtual("dimensions_formatted").get(function () {
    if (!this.coverSize) {
        return "Unknown"
    }

    result = ""
    for (let i = 0; i < this.coverSize.length; i++) {
        result += String(this.coverSize[i]);

        // not end of string
        if (i != this.coverSize.length - 1) {
            result += " x "
        }
        else {
            result += " inches"
        }
    }
    return result;
});

module.exports = mongoose.model("Book", BookSchema);