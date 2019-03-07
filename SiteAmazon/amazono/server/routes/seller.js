const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');//service S3 qui recupérer le sdk des produits amazon
const multer = require('multer');//librairie qui permet d'uploader les images des produits
const multerS3 = require('multer-s3');//librairie qui permet d'uploader le chemin d'accès S3
const s3 = new aws.S3({accessKeyId: "AKIAJZ5YUVKTMPGSL7JQ", secretAccessKey: "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"});

const checkJWT= require('../middlewares/ckeck-jwt'); 
const upload = multer({

    storage: multerS3({
        s3: s3,
        bucket: 'amazonowebapplication',
        metadata: function(req,file,cb){
            cb(null, {fieldName: file.fieldname});
        },
      /*  key: function(req,file,cb){
            cb(null,{fieldName:file.fieldName});
        },*/
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
          } 
    })
});
//création route des produits
router.route('/products')
    .get(checkJWT,(req,res,next)=>{
        Product.find({ owner: req.decoded.user._id})
          .populate('owner')
          .populate('category')
          .exec((err,products) =>{
              if(products){
                  res.json({
                      success:true,
                      message: "Products",
                      products:products
                  })
              }
          });
    })
    .post([checkJWT, upload.single('product_picture')],(req, res, next) =>{
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();

        res.json({
            success:true,
            message: 'Successfully Added the product'
        });
    });

module.exports = router;