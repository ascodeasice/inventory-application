const Book = require("../models/book");
const Publisher = require("../models/publisher");
const Category = require("../models/category");
const Author = require("../models/author");
const async = require("async");

// Display list of all books.
exports.index = (req, res) => {
    res.render("index", {
        title: "Amason",
        logoURL: "./images/amasonLogo.png",
    })
}

exports.book_list = (req, res, next) => {
    Book.find({})
        .sort({ title: 1 })
        .exec(
            (err, books) => {
                if (err) {
                    return next(err);
                }
                res.render("book_list", {
                    title: "All books",
                    logoURL: "../images/amasonLogo.png",
                    books: books,
                });
            }
        )
};

// Display detail page for a specific book.
exports.book_detail = (req, res, next) => {
    Book.findById(req.params.id)
        .populate("author")
        .populate("publisher")
        .populate("category")
        .exec((err, book) => {
            if (err) {
                return next(err);
            }
            if (book == null) {
                // book not found
                const error = new Error("Book not found");
                error.status = 404;
                next(error);
            }
            // success
            res.render("book_detail", {
                title: book.title,
                logoURL: "../../images/amasonLogo.png",
                book: book,
            });
        });
};

// Display book create form on GET.
exports.book_create_get = (req, res, next) => {
    async.parallel({
        categories(callback) {
            Category.find({})
                .sort({ name: 1 })
                .exec(callback)
        },
        authors(callback) {
            Author.find({})
                .sort({ name: 1 })
                .exec(callback)
        },
        publishers(callback) {
            Publisher.find({})
                .sort({ name: 1 })
                .exec(callback)
        },
    },
        (err, results) => {
            if (err) {
                return next(err);
            }

            res.render("book_form", {
                title: "Create book",
                logoURL: "../../images/amasonLogo.png",
                categories: results.categories,
                publishers: results.publishers,
                authors: results.authors,
            });
        }
    )
};

// Handle book create on POST.
exports.book_create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: book create POST");
};

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: book delete POST");
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: book update GET");
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: book update POST");
};
