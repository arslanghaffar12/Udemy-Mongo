const mongoose = require("mongoose");

const pictureSchema = new mongoose.Schema({
    title : {type : String},
    imageUrl : {type : String}
})

const Picture = mongoose.model('Image', pictureSchema);
module.exports = Picture;