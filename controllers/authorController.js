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
                    logoURL: "../images/amasonLogo.png",
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
                logoURL: "../../images/amasonLogo.png",
                itemName: "author",
                books: results.books,
            });
        });
};

// Display author create form on GET.
exports.author_create_get = (req, res, next) => {
    res.render("general_form",
        {
            title: "Create author",
            logoURL: "../../images/amasonLogo.png",
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
                logoURL: "../../images/amasonLogo.png",
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
exports.author_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: author delete GET");
};

// Handle author delete on POST.
exports.author_delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: author delete POST");
};

// Display author update form on GET.
exports.author_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: author update GET");
};

// Handle author update on POST.
exports.author_update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: author update POST");
};
