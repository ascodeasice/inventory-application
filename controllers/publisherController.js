const Publisher = require("../models/publisher");
const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all publishers.
exports.publisher_list = (req, res, next) => {
    Publisher.find({})
        .sort({ name: 1 })
        .exec(
            (err, publishers) => {
                if (err) {
                    return next(err);
                }
                res.render("general_list", {
                    title: "All publishers",
                    logoURL: "../images/amasonLogo.png",
                    items: publishers,
                    itemName: "publisher",
                });
            });
};

// Display detail page for a specific publisher.
exports.publisher_detail = (req, res, next) => {
    async.parallel(
        {
            books(callback) {
                Book.find({ publisher: req.params.id })
                    .sort({ title: 1 })
                    .exec(callback)
            },
            publisher(callback) {
                Publisher.findById(req.params.id)
                    .exec(callback)
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.publisher == null) {
                const error = new Error("Publisher not found");
                error.status = 404;
                return next(error);
            }
            res.render("general_detail", {
                title: results.publisher.name,
                logoURL: "../../images/amasonLogo.png",
                itemName: "publisher",
                books: results.books,
            });
        });
}

// Display publisher create form on GET.
exports.publisher_create_get = (req, res) => {
    res.render("general_form", {
        title: "Create publisher",
        logoURL: "../../images/amasonLogo.png",
    });
};

// Handle publisher create on POST.
exports.publisher_create_post = [
    // Validation
    body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Publisher name is required"),

    (req, res, next) => {
        const errors = validationResult(req);

        const newPublisher = new Publisher({ name: req.body.name });
        if (!errors.isEmpty()) {
            res.render("general_form", {
                title: "Create publisher",
                logoURL: "../../images/amasonLogo.png",
                item: newPublisher,
                errors: errors.array(),
            });
            return;
        }
        else {
            Publisher.findOne({ name: req.body.name })
                .exec((err, found_publisher) => {
                    if (err) {
                        return next(err);
                    }
                    if (found_publisher) {
                        // publisher is duplicated
                        res.redirect(found_publisher.url);
                    }
                    else {
                        newPublisher.save((err) => {
                            if (err) {
                                return next(err);
                            }

                            res.redirect(newPublisher.url);
                        });
                    }
                });
        }
    }
]

// Display publisher delete form on GET.
exports.publisher_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: publisher delete GET");
};

// Handle publisher delete on POST.
exports.publisher_delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: publisher delete POST");
};

// Display publisher update form on GET.
exports.publisher_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: publisher update GET");
};

// Handle publisher update on POST.
exports.publisher_update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: publisher update POST");
};
