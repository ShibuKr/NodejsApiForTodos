import  express  from "express";
import { getUser , newUser, loginUser, logoutUser} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";


const router = express.Router()

router.get('/me',isAuthenticated,getUser)

// router.route('/userid/:id').get(getUser).put(updateUser).delete(deleteUser)

// router.get('/userid/:id', getUser)
// router.put('/userid/:id', updateUser)
// router.delete('/userid/:id', deleteUser)
router.post('/new',newUser)
router.post('/login',loginUser)
router.get('/logout',logoutUser)

export default router