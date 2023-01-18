const Category = require("../models/category");
const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all categories.
exports.category_list = (req, res, next) => {
    Category.find({})
        .sort({ name: 1 })
        .exec(
            (err, categories) => {
                if (err) {
                    return next(err);
                }
                res.render("general_list", {
                    title: "All categories",
                    logoURL: "../images/amasonLogo.png",
                    items: categories,
                    itemName: "category",
                });
            });
};

// Display detail page for a specific category.
exports.category_detail = (req, res, next) => {
    async.parallel(
        {
            books(callback) {
                Book.find({ category: req.params.id })
                    .sort({ title: 1 })
                    .exec(callback)
            },
            category(callback) {
                Category.findById(req.params.id)
                    .exec(callback)
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.category == null) {
                const error = new Error("Author not found");
                error.status = 404;
                return next(error);
            }
            res.render("general_detail", {
                title: results.category.name,
                logoURL: "../../images/amasonLogo.png",
                itemName: "category",
                books: results.books,
            });
        });
}

// Display category create form on GET.
exports.category_create_get = (req, res) => {
    res.render("general_form",
        {
            title: "Create category",
            logoURL: "../../images/amasonLogo.png",
        });
};

// Handle category create on POST.
exports.category_create_post = [
    // Validation
    body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Category name is required"),

    (req, res, next) => {
        const errors = validationResult(req);

        const newCategory = new Category({ name: req.body.name });
        if (!errors.isEmpty()) {
            res.render("general_form", {
                title: "Create category",
                logoURL: "../../images/amasonLogo.png",
                item: newCategory,
                errors: errors.array(),
            });
            return;
        }
        else {
            Category.findOne({ name: req.body.name })
                .exec((err, found_category) => {
                    if (err) {
                        return next(err);
                    }
                    if (found_category) {
                        // category is duplicated
                        res.redirect(found_category.url);
                    }
                    else {
                        newCategory.save((err) => {
                            if (err) {
                                return next(err);
                            }

                            res.redirect(newCategory.url);
                        });
                    }
                });
        }
    }
]

// Display category delete form on GET.
exports.category_delete_get = (req, res) => {
    res.send("NOT IMPLEMENTED: category delete GET");
};

// Handle category delete on POST.
exports.category_delete_post = (req, res) => {
    res.send("NOT IMPLEMENTED: category delete POST");
};

// Display category update form on GET.
exports.category_update_get = (req, res) => {
    res.send("NOT IMPLEMENTED: category update GET");
};

// Handle category update on POST.
exports.category_update_post = (req, res) => {
    res.send("NOT IMPLEMENTED: category update POST");
};
