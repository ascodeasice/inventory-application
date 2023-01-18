const Category = require("../models/category");

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
exports.category_detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: category detail: ${req.params.id}`);
};

// Display category create form on GET.
exports.category_create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: category create GET");
};

// Handle category create on POST.
exports.category_create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: category create POST");
};

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
