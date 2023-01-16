#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Book = require('./models/book')
var Author = require('./models/author')
var Category = require('./models/category')
var Publisher = require('./models/publisher')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var categories = []
var books = []
var publishers = []

function authorCreate(name, cb) {
    authordetail = { name: name }

    var author = new Author(authordetail);

    author.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Author: ' + author);
        authors.push(author)
        cb(null, author)
    });
}

function categoryCreate(name, cb) {
    var category = new Category({ name: name });

    category.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Category: ' + category);
        categories.push(category)
        cb(null, category);
    });
}

function bookCreate(title,
    description,
    category,
    price,
    numberInStock,
    pages,
    publisher,
    isbn,
    coverSize,
    author,
    publicationDate,
    cb) {

    bookdetail = {
        title: title,
        description: description,
        category: category,
        price: price,
        numberInStock: numberInStock,
        pages: pages,
        publisher: publisher,
        isbn: isbn,
        coverSize: coverSize,
        author: author,
        publicationDate: publicationDate ? publicationDate : null,
    }

    var book = new Book(bookdetail);
    book.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Book: ' + book);
        books.push(book)
        cb(null, book)
    });
}


function publisherCreate(name, cb) {
    var publisher = new Publisher({ name: name });
    publisher.save(function (err) {
        if (err) {
            console.log('ERROR CREATING Publisher: ' + publisher);
            cb(err, null)
            return
        }
        console.log('New Publisher: ' + publisher);
        publishers.push(publisher)
        cb(null, publisher)
    });
}


function createCategoryAuthorsPublishers(cb) {
    async.series([
        function (callback) {
            authorCreate('James Clear', callback);
        },
        function (callback) {
            authorCreate('Robert Greene', callback);
        },
        function (callback) {
            authorCreate('Eric Carle', callback);
        },
        function (callback) {
            authorCreate('Robert T. Kiyosaki', callback);
        },
        function (callback) {
            authorCreate('Haruki Murakami', callback);
        },
        function (callback) {
            categoryCreate("Self-Help", callback);
        },
        function (callback) {
            categoryCreate("Children's books", callback);
        },
        function (callback) {
            categoryCreate("Business & Money", callback);
        },
        function (callback) {
            categoryCreate("Literature & Fiction", callback);
        },
        function (callback) {
            publisherCreate("Avery", callback);
        },
        function (callback) {
            publisherCreate("Penguin Books", callback);
        },
        function (callback) {
            publisherCreate("World of Eric Carle", callback);
        },
        function (callback) {
            publisherCreate("Plata Publishing", callback);
        },
        function (callback) {
            publisherCreate("Vintage", callback);
        }
    ],
        // optional callback
        cb);
}


function createBooks(cb) {
    async.parallel([
        function (callback) {
            bookCreate('Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
                `Atomic Habits will reshape the way you think about progress and success,
                 and give you the tools and strategies you need to transform your habits--
                 whether you are a team looking to win a championship,
                  an organization hoping to redefine an industry,
                   or simply an individual who wishes to quit smoking,
                    lose weight, reduce stress, or achieve any other goal.`,
                categories[0],
                14.11,
                9,
                320,
                publishers[0],
                '90735211299',
                [6.28, 1.01, 9.27],
                authors[0],
                new Date(2018, 10, 16),
                callback);
        },
        function (callback) {
            bookCreate('The 48 Laws of Power',
                `In the book that People magazine proclaimed
                 “beguiling” and “fascinating,”
                  Robert Greene and Joost Elffers have distilled
                   three thousand years of the history of power
                    into 48 essential laws by drawing from the
                     philosophies of Machiavelli, Sun Tzu, and
                      Carl Von Clausewitz and also from the
                       lives of figures ranging from Henry
                        Kissinger to P.T. Barnum.`,
                categories[0],
                13.59,
                3,
                452,
                publishers[1],
                '0140280197',
                [9.1, 6.4, 1.3],
                authors[1],
                new Date(2000, 9, 1),
                callback);
        },
        function (callback) {
            bookCreate('The Very Hungry Caterpillar',
                `THE all-time classic picture book, from generation to generation, sold somewhere in the world every 30 seconds! A sturdy and beautiful book to give as a gift for new babies, baby showers, birthdays, and other new beginnings!`,
                categories[1],
                5.74,
                13,
                26,
                publishers[2],
                '0399226907',
                [7.13, 0.65, 4.94],
                authors[2],
                new Date(1994, 3, 23),
                callback);
        },
        function (callback) {
            bookCreate('Rich Dad Poor Dad: What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!',
                `Rich Dad Poor Dad is Robert's story of growing up with two dads — his real father and the father of his best friend, his rich dad — and the ways in which both men shaped his thoughts about money and investing. The book explodes the myth that you need to earn a high income to be rich and explains the difference between working for money and having your money work for you.`,
                categories[2],
                7.68,
                7,
                336,
                publishers[3],
                '0399226907',
                [4.25, 1, 6.75],
                authors[3],
                new Date(1994, 3, 23),
                callback);
        },
        function (callback) {
            bookCreate('Norwegian Wood (Vintage International) ',
                `Toru, a serious young college student in Tokyo, is devoted to Naoko, a beautiful and introspective young woman, but their mutual passion is marked by the tragic death of their best friend years before. As Naoko retreats further into her own world, Toru finds himself drawn to a fiercely independent and sexually liberated young woman.`,
                categories[3],
                19.03,
                1,
                400,
                publishers[4],
                '00274811057',
                [4.13, 0.83, 6.89],
                authors[4],
                new Date(2011, 1, 25),
                callback);
        },
        function (callback) {
            bookCreate('Kafka on the Shore (Vintage International)',
                `Here we meet a teenage boy, Kafka Tamura, who is on the run, and Nakata, an aging simpleton who is drawn to Kafka for reasons that he cannot fathom. As their paths converge, acclaimed author Haruki Murakami enfolds readers in a world where cats talk, fish fall from the sky, and spirits slip out of their bodies to make love or commit murder, in what is a truly remarkable journey.`,
                categories[3],
                14.52,
                17,
                505,
                publishers[4],
                '9780099458326',
                [5.08, 1.18, 7.8],
                authors[4],
                new Date(2005, 1, 1),
                callback);
        },
    ],
        // optional callback
        cb);
}

async.series(
    [
        createCategoryAuthorsPublishers,
        createBooks,
    ],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        else {
            console.log('BOOKInstances: ' + publishers);

        }
        // All done, disconnect from database
        mongoose.connection.close();
    });



