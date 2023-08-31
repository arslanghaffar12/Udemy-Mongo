const express = require("express");
const Employee = require("../models/employeModel");
const router = express.Router();
const multer = require('multer');
const path = require("path");
const Picture = require("../models/pictureModel");
const fs= require("fs")






router.get("/", (req, res) => {

    Employee.find()
        .then(emp => {
            res.render('employee', { employees: emp })
        })
        .catch(err => {
            console.log(err);
        })

})

router.get("/add-employee", (req, res) => {
    res.render("add-employee")
})

router.post("/add-employee", (req, res) => {
    console.log("request is", req);
    const newEmp = {
        name: req.body.name,
        age: req.body.age,
        position: req.body.position
    }

    Employee.create(newEmp)
        .then(emp => {
            res.redirect("/")
        })
        .catch(err => {
            console.log(err);
        })
})


router.get("/search", (req, res) => {
    res.render("search-employee", { employee: '' })
})

router.get("/employee-search", (req, res) => {
    const searchQuery = { name: req.query.name };
    Employee.findOne(searchQuery)
        .then(emp => {
            res.render("search-employee", { employee: emp })
        })
        .catch(err => {
            console.log(err);
        })
})

router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    Employee.findById(id)
        .then(emp => {
            res.render("edit", { employee: emp })
        })
        .catch(err => {
            console.log(err);
        })
})

router.post("/edit-employee", (req, res) => {
    let { id, name, position, age } = req.body;
    const updatedEmp = {
        name: name,
        position: position,
        age: age
    }

    Employee.findByIdAndUpdate(id, updatedEmp)
        .then(emp => {
            res.redirect("/")
        })
        .catch(err => {
            console.log(err);
        })

})

router.post("/delete-employee", (req, res) => {
    const queryParam = { id: req.body.id };
    Employee.deleteOne(queryParam)
        .then(emp => {
            res.redirect("/")
        })
        .catch(err => {
            console.log('error while deleting', err);
        })
})

router.get("/file-upload", (req, res) => {
    res.render("file-transfer")

})

const storage = multer.diskStorage({
    destination: './public/uploads/images/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkFiletype(file, cb)
    }
});


function checkFiletype(file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        return cb(null, true)
    } else {
        cb("Error : Please select other type")
    }

}

router.post("/singleUpload", upload.single("singleFile"), (req, res) => {
    const file = req.file;
    if (!file) {
        return console.log('files does not exist');
    }

    let url = file.path.replace('public', '')

    Picture.findOne({ imageUrl: url })
        .then(img => {
            if (img) {
                console.log('picture already exist');
                return res.redirect('/file-upload');
            }

            Picture.create({ imageUrl: url })
                .then(img => {
                    console.log('image is saved');
                    return res.redirect("/uploaded")
                })
        })

    console.log(file.path);

})

router.post("/upload-multiple", upload.array("multipleFiles"), (req, res) => {
    const files = req.files;
    if (!files) {
        console.log("upload images first")
    }

    files.forEach(file => {
        let url = file.path.replace('public', '');
        Picture.findOne({ imageUrl: url })
            .then(img => {
                if (img) {
                    console.log("picture is duplicate");
                }

                Picture.create({ imageUrl: url })
                    .then(im => {
                        return res.redirect("/uploaded")
                    })
                    .catch(err => {
                        console.log("Error while multiple uploading");
                    })

            })

    });

})


router.get("/uploaded", (req, res) => {
    Picture.find()
        .then(img => {
            res.render('uploaded', { images: img })
        })
        .catch(err => {
            console.log('error whhile getting image');
        })

})

router.post("/delete-picture", (req, res) => {
    let queryParam = { id: req.body.id };
    Picture.findOne(queryParam)
        .then(pic => {
            const imagePath = path.join(__dirname, '..', 'public', pic.imageUrl);
            console.log('imagePath is', imagePath);
            console.log("__dirname is",__dirname);
            fs.unlink(imagePath, (err) => {
                if(err){
                    return console.log('err',err);
                }
                Picture.deleteOne(queryParam)
                    .then(img => {
                        res.redirect("/uploaded")

                    })
                    .catch(err => {
                        console.log(err);
                    })

            })
        })
        .catch(err => {
            console.log(err);
        })
})


module.exports = router;