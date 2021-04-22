const express = require('express');
const router = express.Router();
const {index,chat,submit} = require('../controllers/IndexController');

router.get("/",index);
router.get("/chat",chat);
router.post('/',submit);
module.exports = router;