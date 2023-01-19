const Author = require("../models/author");
const Book = require("../models/book")
const async = require("async");
const author = require("../models/author");
const { body, validationResult } = require("express-validator");

// Display list of all authors.
exports.author_list = (req, res, next) => {
    Author.find({})
        .sort({ name: 1 })
        .exec(
            (err, authors) => {
                if (err) {
                    return next(err);
                }
                res.render("general_list", {
                    title: "All authors",
                    items: authors,
                    itemName: "author",
                });
            });
};

// Display detail page for a specific author.
exports.author_detail = (req, res, next) => {
    async.parallel(
        {
            books(callback) {
                Book.find({ author: req.params.id })
                    .sort({ title: 1 })
                    .exec(callback)
            },
            author(callback) {
                Author.findById(req.params.id)
                    .exec(callback)
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.author == null) {
                const error = new Error("Author not found");
                error.status = 404;
                return next(error);
            }
            res.render("general_detail", {
                title: results.author.name,
                itemName: "author",
                books: results.books,
                item: results.author,
            });
        });
};

// Display author create form on GET.
exports.author_create_get = (req, res, next) => {
    res.render("general_form",
        {
            title: "Create author",
        });
};

// Handle author create on POST.
exports.author_create_post = [
    // Validation
    body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Author name is required"),

    (req, res, next) => {
        const errors = validationResult(req);

        const newAuthor = new Author({ name: req.body.name });
        if (!errors.isEmpty()) {
            res.render("general_form", {
                title: "Create author",
                item: newAuthor,
                errors: errors.array(),
            });
            return;
        }
        else {
            Author.findOne({ name: req.body.name })
                .exec((err, found_author) => {
                    if (err) {
                        return next(err);
                    }
                    if (found_author) {
                        // author is duplicated
                        res.redirect(found_author.url);
                    }
                    else {
                        newAuthor.save((err) => {
                            if (err) {
                                return next(err);
                            }

                            res.redirect(newAuthor.url);
                        });
                    }
                });
        }
    }
]

// Display author delete form on GET.
exports.author_delete_get = (req, res, next) => {
    async.parallel(
        {
            books(callback) {
                Book.find({ author: req.params.id })
                    .sort({ title: 1 })
                    .exec(callback)
            },
            author(callback) {
                Author.findById(req.params.id)
                    .exec(callback)
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.author == null) {
                const error = new Error("Author not found");
                error.status = 404;
                return next(error);
            }
            res.render("general_delete", {
                title: results.author.name,
                itemName: "author",
                books: results,
                item: results.author,
            });
        });
};

// Handle author delete on POST.
exports.author_delete_post = (req, res, next) => {
    async.parallel(
        {
            author(callback) {
                Author.findById(req.body.id).exec(callback);
            },
            books(callback) {
                Book.find({ author: req.body.id }).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.books.length > 0) {
                res.render("general_delete", {
                    title: results.author.name,
                    itemName: "author",
                    item: results.author,
                    books: results.books,
                });
                return;
            }

            Author.findByIdAndRemove(req.body.id, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/catalog/authors");
            });
        }
    );
};

// Display author update form on GET.
exports.author_update_get = (req, res, next) => {
    Author.findById(req.params.id).exec((err, author) => {
        if (err) {
            return next(err);
        }
        if (author == null) {
            const error = new Error("Author not found");
            error.status = 404;
            return next(error);
        }

        // success
        res.render("general_form", {
            title: "Update author",
            item: author,
        });
    });
};

// Handle author update on POST.
exports.author_update_post = [
    body("name", "Author name is required").trim().isLength({ min: 1 }),
    (req, res, next) => {
        const errors = validationResult(req);

        const newAuthor = new Author({
            name: req.body.name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render("general_form", {
                title: "Update author",
                item: newAuthor,
                errors: errors.array(),
            });
            return;
        }
        else {
            Author.findByIdAndUpdate(req.params.id, newAuthor, {}, (err, oldAuthor) => {
                if (err) {
                    return next(err);
                }

                res.redirect(oldAuthor.url);
            });
        }
    }
]
