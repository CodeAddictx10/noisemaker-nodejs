const express = require("express");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const path = require("path");
const app = express();
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    }),
);
const port = 5000;

app.set("views", path.join(__dirname, "views"));
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
app.post("/add", async (req, res) => {
    //async makes the image show on add else it would takes longer
    if (req.files) {
        let file = req.files.photo;

        // save image to cloudinary
        try {
            let res = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "nodejs",
            });
            let newName = {
                name: req.body.name,
                pic: res.secure_url,
                times: 1,
            };
            noiselist.push(newName);
            console.log("success");
        } catch (error) {
            console.log("An error has occured");
        }

        // Save image to local directory
        // file.mv(` ${path.join(__dirname, "uploads")}/${file.name}`, (err) => {
        //     if (err) {
        //         console.log("An error has occured");
        //     } else {
        //         let newName = { name: req.body.name, pic: file.name, times: 1 };
        //         console.log(newName);
        //         noiselist.push(newName);
        //     }
        // });
    }
    res.redirect("/");
});
