const router = require('express').Router();
const { validateUsersBody } = require('../middlewares/validation');
const { getUsersProfileInfo, updateUsersProfile } = require('../controllers/users');

router.get('/me', getUsersProfileInfo);
router.patch('/me', validateUsersBody, updateUsersProfile);
module.exports = router;
