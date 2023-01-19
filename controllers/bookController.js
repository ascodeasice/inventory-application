const Book = require("../models/book");
const Publisher = require("../models/publisher");
const Category = require("../models/category");
const Author = require("../models/author");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all books.
exports.index = (req, res) => {
    res.render("index", {
        title: "Amason",
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
                categories: results.categories,
                publishers: results.publishers,
                authors: results.authors,
            });
        }
    )
};

// Handle book create on POST.
exports.book_create_post = [
    body("title", "Title is required")
        .trim()
        .isLength({ min: 1 }),
    body("description", "Description is required")
        .trim()
        .isLength({ min: 1 }),
    body("category", "Category is required")
        .trim()
        .isLength({ min: 1 }),
    body("price")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be positive"),
    body("numberInStock")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Number in stock is required")
        .isFloat({ min: 0 })
        .withMessage("Number in stock must be positive"),
    body("publisher", "Publisher is required")
        .trim()
        .isLength({ min: 1 }),
    body("isbn", "ISBN is required")
        .trim()
        .isLength({ min: 1 }),
    body("width")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Width is required")
        .isFloat({ min: 0 })
        .withMessage("Width must be positive"),
    body("depth")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Depth is required")
        .isFloat({ min: 0 })
        .withMessage("Depth must be positive"),
    body("height")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Height is required")
        .isFloat({ min: 0 })
        .withMessage("Height must be positive"),
    body("author", "Author is required")
        .trim()
        .isLength({ min: 1 }),
    body("publicationDate", "Invalid publication date")
        .isISO8601()
        .toDate(),

    (req, res, next) => {
        const errors = validationResult(req);
        const newBook = new Book({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            pages: req.body.pages,
            publisher: req.body.publisher,
            isbn: req.body.isbn,
            coverSize: [req.body.width, req.body.depth, req.body.height],
            author: req.body.author,
            publicationDate: req.body.publicationDate,
        });

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    authors(callback) {
                        Author.find({})
                            .sort({ name: 1 })
                            .exec(callback);
                    },
                    categories(callback) {
                        Category.find({})
                            .sort({ name: 1 })
                            .exec(callback);
                    },
                    publishers(callback) {
                        Publisher.find({})
                            .sort({ name: 1 })
                            .exec(callback);
                    }
                },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }

                    res.render("book_form", {
                        title: "Create book",
                        book: newBook,
                        authors: results.authors,
                        categories: results.categories,
                        publishers: results.publishers,
                        errors: errors.array(),
                    });
                }
            );
            return;
        }

        // no errors
        newBook.save((err) => {
            if (err) {
                return next(err);
            }

            res.redirect(newBook.url);
        });
    }
]
// Display book delete form on GET.
exports.book_delete_get = (req, res, next) => {
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
            res.render("book_delete", {
                title: book.title,
                book: book,
            });
        });
};

// Handle book delete on POST.
exports.book_delete_post = (req, res, next) => {
    Book.findById(req.body.bookId).exec(
        (err, book) => {
            if (err) {
                return next(err);
            }
            Book.findByIdAndRemove(req.body.bookId, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/catalog/books");
            });
        }
    );
};

// Display book update form on GET.
exports.book_update_get = (req, res, next) => {
    async.parallel(
        {
            book(callback) {
                Book.findById(req.params.id).exec(callback);
            },
            authors(callback) {
                Author.find({}).sort({ name: 1 }).exec(callback);
            },
            categories(callback) {
                Category.find({}).sort({ name: 1 }).exec(callback);
            },
            publishers(callback) {
                Publisher.find({}).sort({ name: 1 }).exec(callback);
            },
        },
        (err, results) => {
            if (err) {
                return next(err);
            }

            if (results.book == null) {
                const error = new Error("Book not found");
                error.status = 404;
                return next(error);
            }

            res.render("book_form", {
                title: "Update book",
                book: results.book,
                authors: results.authors,
                categories: results.categories,
                publishers: results.publishers,
            });
        }
    );
};

// Handle book update on POST.
exports.book_update_post = [
    body("title", "Title is required")
        .trim()
        .isLength({ min: 1 }),
    body("description", "Description is required")
        .trim()
        .isLength({ min: 1 }),
    body("category", "Category is required")
        .trim()
        .isLength({ min: 1 }),
    body("price")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be positive"),
    body("numberInStock")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Number in stock is required")
        .isFloat({ min: 0 })
        .withMessage("Number in stock must be positive"),
    body("publisher", "Publisher is required")
        .trim()
        .isLength({ min: 1 }),
    body("isbn", "ISBN is required")
        .trim()
        .isLength({ min: 1 }),
    body("width")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Width is required")
        .isFloat({ min: 0 })
        .withMessage("Width must be positive"),
    body("depth")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Depth is required")
        .isFloat({ min: 0 })
        .withMessage("Depth must be positive"),
    body("height")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Height is required")
        .isFloat({ min: 0 })
        .withMessage("Height must be positive"),
    body("author", "Author is required")
        .trim()
        .isLength({ min: 1 }),
    body("publicationDate", "Invalid publication date")
        .isISO8601()
        .toDate(),

    (req, res, next) => {
        const errors = validationResult(req);
        const newBook = new Book({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            pages: req.body.pages,
            publisher: req.body.publisher,
            isbn: req.body.isbn,
            coverSize: [req.body.width, req.body.depth, req.body.height],
            author: req.body.author,
            publicationDate: req.body.publicationDate,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            async.parallel(
                {
                    authors(callback) {
                        Author.find({})
                            .sort({ name: 1 })
                            .exec(callback);
                    },
                    categories(callback) {
                        Category.find({})
                            .sort({ name: 1 })
                            .exec(callback);
                    },
                    publishers(callback) {
                        Publisher.find({})
                            .sort({ name: 1 })
                            .exec(callback);
                    }
                },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }

                    res.render("book_form", {
                        title: "Create book",
                        book: newBook,
                        authors: results.authors,
                        categories: results.categories,
                        publishers: results.publishers,
                        errors: errors.array(),
                    });
                }
            );
            return;
        }
        else {
            // no errors
            Book.findByIdAndUpdate(req.params.id, newBook, {}, (err, oldBook) => {
                if (err) {
                    return next(err);
                }

                res.redirect(oldBook.url);
            });
        }
    }
]