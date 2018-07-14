var express = require('express');
var router = express.Router();
var userSQL = require('../dao/userSQL');
var crypto = require('crypto');
const { check, validationResult } = require('express-validator/check');

router.get("/login", function (req, res, next) {
    if(req.session.user != undefined && req.session.isAuth) return res.redirect("/");
    var redirect = undefined;
    if(req.query.redirect) redirect = req.query.redirect;
    res.render('login', {title: "Login", redirect: encodeURIComponent(redirect)});
});

router.post('/login', function(req, res) {
    var username = req.body.username,
        userPwd = req.body.password
    var md5 = crypto.createHmac('md5',"ilovejapanese");
    var password = md5.update(username+userPwd).digest('hex');
    userSQL.getUserNumByNameAndPassword(username, password, function (err, results) {
        console.log(results);                           
        if(results.length == 0) {
            res.render('login',{title: "Login", errors: [{"msg":"使用者或密碼輸入錯誤"}]});
        }
        else {
            res.locals.username = username;
            //設定session
            req.session.username = res.locals.username; 
            req.session.user = results[0]
            if(!(req.query.redirect === undefined)){
                
                console.log(req.query.redirect);
                res.redirect(decodeURIComponent(req.query.redirect));
            }
            else{
                res.redirect('/');
            }                
            
            return;
        }    
    });             
});

router.get("/signin", function(req, res){
    if(req.session.user && req.session.isAuth) return res.redirect("/");
    res.render("signin");
})

router.post("/signin",[check('name', 'Name field is required').not().isEmpty(),
    check('username', 'Username field is required').not().isEmpty(),
    check('password', 'Password field is required').not().isEmpty(),
    check('password2', 'Passwords do not match').custom((value,{req, loc, path}) => {
        if (value !== req.body.password) {
            // trow error if passwords do not match
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    }), ], 
    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("signin",{ errors: errors.array() });
    }
    
    userSQL.getUserNumByName(req.body.username, (err ,result) => {
        if (err){
            _logger.log(err);
            res.redirect('/error');
        }
        if (result.length >= 1){            
            res.status(406).render("signin", { errors: [{"msg" :" username already exists"}]});
        }
        else{
            var md5 = crypto.createHmac('md5',"ilovejapanese");
            var password = md5.update(req.body.username+req.body.password).digest("hex");
            userSQL.createUser(req.body.username, req.body.name, password, function(err ,result){
                if (err){
                    _logger.log(err);
                    res.sendstatus
                }       
                if (result){
                    res.redirect("/");
                }
            })
        }
    });
    if (res.finished) return;
});

router.get("/logout", (req, res, next) =>{
    req.session.destroy();

    return res.redirect('/');
});


module.exports = router;