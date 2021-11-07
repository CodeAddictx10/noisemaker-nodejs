const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
app.use(fileUpload());
const port = 5000;

app.set("view engine", "ejs");

// app.use(express.urlencoded({ bodyParser: true })); //this will through warning body-parser deprecated undefined extended: provide extended option
app.use(express.urlencoded({ extended: true }));

app.use(express.static("uploads"));
app.listen(port, () => {
    console.log(`Listen @ port ${port}`);
});

let noiselist = [];
let addToList = false;
app.get("/", (req, res) => {
    res.render("index", { list: noiselist, showForm: addToList });
});
app.get("/show", (req, res) => {
    addToList = true;
    res.redirect("/");
});
app.get("/hide", (req, res) => {
    addToList = false;
    res.redirect("/");
});

app.get("/ins/:id", (req, res) => {
    let index = req.params.id - 1;
    let toEdit = noiselist[index];
    toEdit.times = toEdit.times + 1;
    res.redirect("/");
});

app.get("/red/:id", (req, res) => {
    let index = req.params.id - 1;
    let toEdit = noiselist[index];
    toEdit.times = toEdit.times > 0 ? toEdit.times - 1 : toEdit.times;
    res.redirect("/");
});

app.get("/rem/:id", (req, res) => {
    let index = req.params.id - 1;
    noiselist.splice(index, 1);
    res.redirect("/");
});
app.post("/add", (req, res) => {
    if (req.files) {
        let file = req.files.photo;
        file.mv(`./uploads/${file.name}`, (err) => {
            if (err) {
                console.log("An error has occured");
            } else {
                let newName = { name: req.body.name, pic: file.name, times: 1 };
                console.log(newName);
                noiselist.push(newName);
            }
        });
    }
    console.log(req.files);
    res.redirect("/");
});
