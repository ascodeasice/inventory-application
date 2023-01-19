const Category = require("../models/category");
const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require("express-validator");
const category = require("../models/category");

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
                itemName: "category",
                books: results.books,
                item: results.category,
            });
        });
}

// Display category create form on GET.
exports.category_create_get = (req, res) => {
    res.render("general_form",
        {
            title: "Create category",
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
exports.category_delete_get = (req, res, next) => {
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
            res.render("general_delete", {
                title: results.category.name,
                itemName: "category",
                books: results.books,
                item: results.category,
            });
        });
};

// Handle category delete on POST.
exports.category_delete_post = (req, res, next) => {
    async.parallel(
        {
            category(callback) {
                Category.findById(req.body.id).exec(callback);
            },
            books(callback) {
                Book.find({ category: req.body.id }).exec(callback);
            }
        },
        (err, results) => {
            if (err) {
                return next(err);
            }
            if (results.books.length > 0) {
                res.render("general_delete", {
                    title: results.category.name,
                    itemName: "category",
                    item: results.category,
                    books: results.books,
                });
                return;
            }

            Category.findByIdAndRemove(req.body.id, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect("/catalog/categories");
            });
        }
    );
};

// Display category update form on GET.
exports.category_update_get = (req, res) => {
    Category.findById(req.params.id).exec((err, category) => {
        if (err) {
            return next(err);
        }
        if (category == null) {
            const error = new Error("Author not found");
            error.status = 404;
            return next(error);
        }

        // success
        res.render("general_form", {
            title: "Update category",
            item: category,
        });
    });
};

// Handle category update on POST.
exports.category_update_post = [
    body("name", "Category name is required").trim().isLength({ min: 1 }),
    (req, res, next) => {
        const errors = validationResult(req);

        const newCategory = new Category({
            name: req.body.name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            res.render("general_form", {
                title: "Update category",
                item: newCategory,
                errors: errors.array(),
            });
            return;
        }
        else {
            Category.findByIdAndUpdate(req.params.id, newCategory, {}, (err, oldCategory) => {
                if (err) {
                    return next(err);
                }

                res.redirect(oldCategory.url);
            });
        }
    }
]

