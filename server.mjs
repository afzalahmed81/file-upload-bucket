import express from "express"
import cors from "cors"
import mongoose from 'mongoose';
import { stringToHash, varifyHash } from "bcrypt-inzi";


// mongoose.connect('mongodb+srv://afzal81:afz@cluster0.9tmbp5a.mongodb.net/file-uploadDataBase?retryWrites=true&w=majority');

import fs from 'fs';
import admin from "firebase-admin";
// import multer from 'multer';


// https://firebase.google.com/docs/storage/admin/start
var serviceAccount = {
    "type": "service_account",
    "project_id": "file-upload-bucket",
    "private_key_id": "d7f7c6d6c07386533a62916cedcd3e7605b6fbff",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrK9lfkWUTo9I5\nb1c6Y2eaBpagWlT+Ce3nAD2Gq4grKev0wOnZi1QnSMIJrMwxJlwL6yUZrum8Urq9\ng5nZLzTLka8ib/RmzsuVL1fFIYHWvJ91X51tulv9ZmSmiHGcYTEwT5NA9cikSlqT\n1AHTmexzCE8RLicHxPJufu02H6XkWsLjbtNj1L3auJ/K1Y72bRKlv909ERxmEsjD\n7DzZjzwiPaPdD1GiHEXvm0pnaJWJ4TbWEnqEIHdrGsczcZ0+Y2Uf/6JY2/Q/EMy4\nt4asKrybDTYZbEpfqSYFKAzBhZFjUabJQkRDnY0JgfowdK+bdCD+yFjUhRzHNRIU\nLLn72IxrAgMBAAECggEABjMVTMS9H85Vyzsse2T33I8zPiDXbxFz/yxajh5TVSoG\nv/uLSm9uf3xRfIXKvFeOHXnSlWMyDnCVfQXWQibXeZsrQS+MuFaEpdL1WuuqQmuT\nNqUmZps3QQDsmr1/FjGoZ35SVM6f0xd7v6PrmU0pq7ShHsUazO3hPj3+Mrojbc4K\nAIA2PhcJqgAK/qvkn/zDRVONr73K8u1+nVSuDaanEb4KCsFcUpDREShf/MpHOTsF\nAdSA8Q25mGBH+a2ZXgoSQk35Mv4MU0FOFqDXnLAsaIkvdJGtuHL+YT89Eb0GZX4v\nr4/+8/AUsp74JCmoWdeIbNKlJFBV/DiBOsAndXGntQKBgQDTVk7YYXV5z5q33uyW\nTQqhfvrmZbYuPvQqTaJcZloNV48zM5/kt+nfCsTxhRfoy6oym1nf2zWJnl5mFaxe\ncQZkaTO5MRz2dwdCdgOLmcqBvAf2y7aVR7Q7KBrZBeB5knttBeUCspVBWYQ6Xl2X\n0a5TU7uzB7YlwnxkCDkM3wP2XQKBgQDPWIBXot7dYWf8GuYkl9MaaAvEX6aBdCGi\nXwm7ttLWW4GLGY6WBZF/M6D35oAY0wT0p0Wm2zJlIEelhXoJkglREZznFi+VnlLH\nuEKyHWxGmL7SSuYf2jZDSHtKqVqdcPyd5DdWS+dm3/9sbA/H2usJgqDkjvNXEbQA\nXQuasrFRZwKBgDtIarWoIRwacHxDvHotAl5rEFaxEXnHjxaO0Iy66Wf0t+bVBHVU\nYfZ/Pt/BRgO3nfa0PXHePBZupmxciA22BuUD3c6FSGqa2R57nGL8sSHTbSh93Knj\ng1tU1LMsQtvXi2f5z1QCZHwAcGcvMXH1D8GwK2b9MstE0z/8ToSdyq7BAoGBAIwm\nXAngcxfcYTcMz4bogK6WqW2A4cEayClCaAfT2cs+at+k1LYe6Wu7cBBgYzFkYTMl\nZXUVMIkeOo9tG0Igzd9YMmAYpO1S6M1KhPpz3N4THNhz+/yHuKnd8khTFIba+kWX\nHrhb8fudaL7WhAwosznoa+xRm7W8p5ifS9qy8hv9AoGBAIgBp0Gt6D3up3Y6KX/y\nsEXpyMFsz52VtDnTIb8v5ozmuF51ZINNld3pCXPh+o4a22uQ1gpqxW9CR0eUqGIJ\nC0seEw1Y7104C2wl/AYLsSFlOXSmLi4li2Xq8fdRgljsNxmc9NqOwbmb8noxGAgQ\nGPhpyhjqMvmSDfIWSnFJZ/+I\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-m8f9l@file-upload-bucket.iam.gserviceaccount.com",
    "client_id": "103707641507254613615",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-m8f9l%40file-upload-bucket.iam.gserviceaccount.com"
  };
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://file-upload-bucket.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://file-upload-bucket.appspot.com");



//==============================================
import multer from 'multer';
const storageConfig = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {

        console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
var upload = multer({ storage: storageConfig })

//==============================================

const app = express();
app.use(express.json());  // parsing body
// app.use(cors());
 app.use(cors({
    origin: ['http://localhost:3000','https://file-upload-bucket.firebaseapp.com/',"*"],
//     // credentials: true
 }));


const port = process.env.PORT || 5001;

const userSchema = new mongoose.Schema({
    // firstName: { type: String },
    // lastName: { type: String },
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },
    // age: { type: Number, min: 17, max: 65, default: 18 },
    // isMarried: { type: Boolean, default: false },

    createdOn: { type: Date, default: Date.now },
});

const userModel = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    // code: { type: String, required: true },
    productImage: { type: String, required: true },

    createdOn: { type: Date, default: Date.now }
});

const productModel = mongoose.model('product', productSchema);


app.post("/signup", upload.any(), (req, res) => {

    let body = req.body;

    // console.log("body: ", body);
    // console.log("body: ", body.name);
    // console.log("body: ", body.email);
    // console.log("body: ", body.password);

    console.log("file: ", req.files[0]);

    if (!body.name
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "name": "John",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }


    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload-examples
    bucket.upload(
        req.files[0].path,
        {
            destination: `profilePhotos/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                        // delete file from folder before sending response back to client (optional but recommended)
                        // optional because it is gonna delete automatically sooner or later
                        // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }


                        // check if user already exist // query email user
                        userModel.findOne({ email: body.email }, (err, user) => {
                            if (!err) {
                                console.log("user: ", user);

                                if (user) { // user already exist
                                    console.log("user already exist: ", user);
                                    res.status(400).send({ message: "user already exist,, please try a different email" });
                                    return;

                                } else { // user not already exist

                                    stringToHash(body.password).then(hashString => {

                                        userModel.create({
                                            name: body.name,
                                            email: body.email.toLowerCase(),
                                            password: hashString,
                                            profilePicture: urlData[0]
                                        },
                                            (err, result) => {
                                                if (!err) {
                                                    console.log("data saved: ", result);
                                                    res.status(201).send({
                                                        message: "user is created",
                                                        data: {
                                                            name: body.name,
                                                            email: body.email.toLowerCase(),
                                                            profilePicture: urlData[0]
                                                        }
                                                    });
                                                } else {
                                                    console.log("db error: ", err);
                                                    res.status(500).send({ message: "internal server error" });
                                                }
                                            });
                                    })

                                }
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "db error in query" });
                                return;
                            }
                        })


                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });

});


app.get("/users", async (req, res) => {
    try {
        let users = await userModel.find({}).exec();
        console.log("all user : ", users);

        res.send({
            message: "all users",
            data: users
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})

 app.post("/login", (req, res) => {

    let body = req.body;

    if (!body.email || !body.password) { // null check - undefined, "", 0 , false, null , NaN
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user already exist // query email user
    userModel.findOne({ email: body.email },
        //projection !! mongodb feature//
        // { email:1, firstName:1, lastName:1, age:1, password:0 },
        "email firstName lastName age password",
        (err, data) => {
            if (!err) {
                console.log("data: ", data);

                if (data) { // user found
                    varifyHash(body.password, data.password).then(isMatched => {

                        console.log("isMatched: ", isMatched);

                        if (isMatched) {
                            // TODO:  add JWT token
                            res.send({
                                message: "login successful",
                                profile: {
                                    email: data.email,
                                    firstName: data.firstName,
                                    lastName: data.lastName,

                                }
                            });
                            return;
                        } else {
                            console.log("user not found");
                            res.status(401).send({ message: "Incorrect email or password" });
                            return;
                        }
                    })

                } else { // user not already exist
                    console.log("user not found");
                    res.status(401).send({ message: "Incorrect email or password" });
                    return;
                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "login failed, please try later" });
                return;
            }
        })



})




// 

app.post("/product", upload.any(), (req, res) => {

    console.log("product received: ", req.body);

    console.log("file: ", req.files[0]);

    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload-examples
    bucket.upload(
        req.files[0].path,
        {
            destination: `productImages/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                        // delete file from folder before sending response back to client (optional but recommended)
                        // optional because it is gonna delete automatically sooner or later
                        // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }


                        let newProduct = new productModel({
                            name: req.body.name,
                            description: req.body.description,
                            price: req.body.price,
                            // code: req.body.code,
                            productImage: urlData[0],
                        })
                        try {
                            let response = newProduct.save()
                            console.log("product added: ", response);

                            res.send({
                                message: "product added",
                                data: {
                                    name: req.body.name,
                                    description: req.body.description,
                                    price: req.body.price,
                                    // code: req.body.code,
                                    productImage: urlData[0],
                                }
                            });
                        } catch (error) {
                            res.status(500).send({
                                message: "failed to add product"
                            });
                        }
                    }
                })
            }
        })
})

app.get("/products", async (req, res) => {

    try {
        let products = await productModel.find({}).exec();
        console.log("all products: ", products)

        res.status(200).send({
            message: "all products",
            data: products
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });
    }
})

app.get("/product/:id", async (req, res) => {
    try {
        let product = await productModel
            .findOne({ _id: req.params.id })
            .exec();
        console.log("product :", product);

        res.send({
            message: "product",
            data: product
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to get product"
        });

    }
})

app.delete("/product/:id", async (req, res) => {

    console.log("product received: ", req.body);

    try {
        let deleted = await productModel.deleteOne({ _id: req.params.id })
        console.log("product deleted: ", deleted);

        res.send({
            message: "product deleted",
            data: deleted
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to delete product"
        });
    }
})

app.put("/product/:id", async (req, res) => {
    let body = req.body;

    console.log("data to be edited :", body);

    let update = {}
    if (body.name) update.name = body.name
    if (body.description) update.description = body.description
    if (body.price) update.price = body.price
    if (body.code) update.code = body.code

    try {
        let updated = await productModel
            .findOneAndUpdate({ _id: req.params.id }, update, { new: true })
            .exec();

        console.log("product updated: ", updated);

        res.send({
            message: "product updated successfully",
            data: updated
        });
    } catch (error) {
        res.status(500).send({
            message: "failed to update product"
        });
    }

});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://afzal81:afz@cluster0.9tmbp5a.mongodb.net/file-uploadDataBase?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events//////////////////////////////////////////////