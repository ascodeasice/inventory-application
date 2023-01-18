const Publisher = require("../models/publisher");

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
exports.publisher_detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: publisher detail: ${req.params.id}`);
};

// Display publisher create form on GET.
exports.publisher_create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: publisher create GET");
};

// Handle publisher create on POST.
exports.publisher_create_post = (req, res) => {
    res.send("NOT IMPLEMENTED: publisher create POST");
};

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
