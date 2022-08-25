/***
 * *GET/POST Example * Node.js -> Express -> ejs -> knex
 */
const listenPort = 2244;// also, gives us a constant that we can use throughout the file
//192.168.1.142
/* Requires */
//provides us access to the express library
let express = require("express"); //loads the exress link into the application
//let path = require("path");

/* we do things through and by the instance of Express */
let app = express(); // object of type express

//post express 4.16, use
app.use(express.urlencoded({ extended: true }));//whenever I do express stuff, this lets me put special chars in the url

//converts ejs format into html pages prior to returning them to browser
app.set("view engine", "ejs");//set the "view engine" to the value of "ejs"

/* initialize the web server on specified port  */
//tells what port to listen on, and has a callback function
app.listen(listenPort, function () {
    console.log("Uhh, thirsty? Good, I'm listening on port " + listenPort)
});

/* UP TO THIS POINT, YOU NEED THIS CODE TO MAKE 
AN EXPRESS APP USING EJS */

/* set up the database connection via knex */
/* requires installation of sqlite3 and knex */
let knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./FizzMenu.db"
    },
    useNullAsDefault: true
});

/* ********************* ROUTES ********************* */

//sets up drinklist, amongst other things
app.get("/drinklist", function (req,res) {
    knex.from("Drinklist").select("*").orderBy("drinkName", "drinkIngred", "drinkPrice")
    .then(drinks => {
        console.log("Drinks: " + drinks.length);
        res.render("drinklist", { drinkList: drinks });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ err });
    });
});

//sets up addDrink
app.get("/addDrink", (req,res) => {
    res.render('addDrink');
});

//need to send it back to drinklist with new info.
app.post('/addDrink', (req,res) => {
    knex('Drinklist').insert(req.body).then(drink => {
        res.redirect('/drinklist');
    })
});

//sets up updDrink
app.get('/updDrink/:id', (req,res) => {
    knex('Drinklist').where('id', req.params.id)
        .then(results => {
            res.render("updDrink", { drink: results });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ err });
            });
});

app.post('/updDrink', (req,res) => {
    knex('Drinklist').where({ id: req.body.id }).update({
        id: req.body.id, drinkName: req.body.drinkName,
        drinkIngred: req.body.drinkIngred, 
        drinkPrice: req.body.drinkPrice })
        .then(drink => { res.redirect('/drinklist'); })
});

//delDrink
app.post('/delDrink/:id', (req,res) => {
    knex('Drinklist').where('id', req.params.id).del()
        .then(drink => {
            res.redirect('/drinklist');
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err });
        });
});

//sets up get route for a GET request
app.get('/', function (req,res) {
    console.log("GET /getform");
    res.render('/getpost');
});

app.get('/getform', function (req,res) {
    console.log("GET /getform");
    res.render('getpost');
});

//sets up a route for a POST request
app.post('/getform', function (req,res) {
    console.log("POST /getform");
    res.redirect("/getform");
});