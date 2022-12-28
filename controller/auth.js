const Router = require('express'); //подключение маршрутов
const router = new Router();
const register = require("./register");
const upload = require("./upload");
//const login = require("./login");
//const profile = require("./profile");

router.post("/register",register);
router.post("/upload",upload);
//router.post("/login",login);
//router.get("/profile",profile);
//router.post("/profile",profile);
module.exports = router;
