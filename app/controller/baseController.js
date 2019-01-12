var multer = require('multer');
var bcrypt = require('bcrypt');

var base = {};
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload');
  },
  filename: function (req, file, cb) {
    //file parameter use for get file name
    var ext = file.originalname.split('.')[file.originalname.split('.').length-1];
    cb(null, Date.now() + '.'+ext);
  }
})

var resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload_resume');
  },
  filename: function (req, file, cb) {
    //file parameter use for get file name
    var ext = file.originalname.split('.')[file.originalname.split('.').length-1];
    cb(null, Date.now() + '.'+ext);
  }
})

base.upload = multer({ 
  storage: storage ,
  limits: {fileSize: 5242880},    //5mb image file allowed
  fileFilter: function (req, file, callback) {
        var ext = file.originalname.split('.')[file.originalname.split('.').length-1];
        console.log(file.mimetype.split('/')[0]);
        if(ext == 'png' || ext == 'jpg' || 
        ext == 'gif' || ext == 'jpeg' || 
        ext == 'JPG' || ext == 'PNG') {
          req.result = true;  
        }else if(ext == 'mp3' || ext == 'wav'){
          req.result = true;  
        }else{
          req.result = false;
          req.imageError = (file.mimetype.split('/')[0] == 'image') ? 
          'Invalid Image Format':'Invalid Audio Format';
          return callback(new Error('Only images are allowed'));
        }
        
        callback(null, true);
    }
}).single('image'); //is a name of the image given input

base.uploadResume = multer({ 
  storage: resumeStorage ,
  limits: {fileSize: 5242880},    //5mb image file allowed
  fileFilter: function (req, file, callback) {
        var ext = file.originalname.split('.')[file.originalname.split('.').length-1];
        if(ext == 'docx' || ext == 'doc' || ext == 'PDF' || ext == 'pdf') {
          req.result = true;   
        }else{
          req.result = false;
          req.imageError = 'Invalid Audio Format';
          return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    }
}).single('file'); //is a name of the image given input

base.uniqueCode = (user) => { // user eg:EMP for employee
  return user + Math.floor(100000 + Math.random() * 900000) + new Date().getTime();
}

base.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

base.validPassword = (pwd,hashPwd) => {
    return bcrypt.compareSync(pwd, hashPwd.password);
}
module.exports = base;