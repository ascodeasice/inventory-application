const express = require("express");
const router = express.Router();

// Require controller modules.
const bookController = require("../controllers/bookController");
const authorController = require("../controllers/authorController");
const categoryController = require("../controllers/categoryController");
const publisherController = require("../controllers/publisherController");

/// BOOK ROUTES ///

// GET catalog home page.
router.get("/", bookController.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/book/create", bookController.book_create_get);

// POST request for creating Book.
router.post("/book/create", bookController.book_create_post);

// GET request to delete Book.
router.get("/book/:id/delete", bookController.book_delete_get);

// POST request to delete Book.
router.post("/book/:id/delete", bookController.book_delete_post);

// GET request to update Book.
router.get("/book/:id/update", bookController.book_update_get);

// POST request to update Book.
router.post("/book/:id/update", bookController.book_update_post);

// GET request for one Book.
router.get("/book/:id", bookController.book_detail);

// GET request for list of all Book items.
router.get("/books", bookController.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/author/create", authorController.author_create_get);

// POST request for creating Author.
router.post("/author/create", authorController.author_create_post);

// GET request to delete Author.
router.get("/author/:id/delete", authorController.author_delete_get);

// POST request to delete Author.
router.post("/author/:id/delete", authorController.author_delete_post);

// GET request to update Author.
router.get("/author/:id/update", authorController.author_update_get);

// POST request to update Author.
router.post("/author/:id/update", authorController.author_update_post);

// GET request for one Author.
router.get("/author/:id", authorController.author_detail);

// GET request for list of all Authors.
router.get("/authors", authorController.author_list);

/// category ROUTES ///

// GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get("/category/create", categoryController.category_create_get);

//POST request for creating category.
router.post("/category/create", categoryController.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", categoryController.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", categoryController.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", categoryController.category_update_get);

// POST request to update category.
router.post("/category/:id/update", categoryController.category_update_post);

// GET request for one category.
router.get("/category/:id", categoryController.category_detail);

// GET request for list of all category.
router.get("/categories", categoryController.category_list);

/// publisher ROUTES ///

// GET request for creating a publisher. NOTE This must come before route that displays publisher (uses id).
router.get(
    "/publisher/create",
    publisherController.publisher_create_get
);

// POST request for creating publisher.
router.post(
    "/publisher/create",
    publisherController.publisher_create_post
);

// GET request to delete publisher.
router.get(
    "/publisher/:id/delete",
    publisherController.publisher_delete_get
);

// POST request to delete publisher.
router.post(
    "/publisher/:id/delete",
    publisherController.publisher_delete_post
);

// GET request to update publisher.
router.get(
    "/publisher/:id/update",
    publisherController.publisher_update_get
);

// POST request to update publisher.
router.post(
    "/publisher/:id/update",
    publisherController.publisher_update_post
);

// GET request for one publisher.
router.get("/publisher/:id", publisherController.publisher_detail);

// GET request for list of all publisher.
router.get("/publishers", publisherController.publisher_list);

module.exports = router;
