const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const multerStorage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now()+ '-'+ Math.round(Math.random()*1E9) //+ path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix+'.jpeg');
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb({
            message: "Unsupported File format"
        }, false);
    }
};


// Upload images
const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits:{fieldSize: 2000000}
})


// Resize images
const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map( async (file) => {
            await sharp(file.path)
            .resize(300,300).toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`public/images/products/${file.filename}`)
            // fs.unlinkSync(`public/images/products/${file.filename}`);//codigo para imagem nao ser armazenada localmente
        })
    );
    next();
};


const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(req.files.map( async (file) => {
            await sharp(file.path)
            .resize(300,300).toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`public/images/blogs/${file.filename}`)
            // fs.unlinkSync(`public/images/blogs/${file.filename}`);//codigo para imagem nao ser armazenada localmente
        })
    );
    next();
};



module.exports = {
    uploadPhoto,
    productImgResize,
    blogImgResize
}