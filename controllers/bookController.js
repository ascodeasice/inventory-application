const Book = require("../models/book");

// Display list of all books.
exports.index = (req, res) => {
    res.render("index", {
        title: "Amason"
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
exports.book_detail = (req, res) => {
    res.send(`NOT IMPLEMENTED: book detail: ${req.params.id}`);
};

// Display book create form on GET.
exports.book_create_get = (req, res) => {
    res.send("NOT IMPLEMENTED: book create GET");
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
