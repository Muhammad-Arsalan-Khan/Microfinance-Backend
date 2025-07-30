import express from "express"
const router = express.Router()
import {loancategories,deletedcategory,updatecategory,getloancategories,} from "../controllers/admin/loancategoriesController.js"
import { dayStatusCon } from "../controllers/admin/DayStatus.js"
import { loanApproved } from "../controllers/admin/loanApproved.js"
import { login, signup, OTP } from "../controllers/loginSignupController.js"
import { loanRequest,getLoandata} from "../controllers/loanRequestController.js"
import upload from "../services/multer.js"
import { authCheck, authCheckAdmin } from "../middleware/authCheck.js"
import {loanApllicationReject, loanApllicationApproved, loanApllicationComplete,  getAllLoanApllication, loanApllicationPendding} from "../controllers/admin/loanApplication.js"

//Auth
router.post("/login", login)
router.post("/signup", signup)
router.patch("/otp/:id", OTP)

//user
//Loan request
router
  .route("/loanrequest/:id")
  .get(authCheck, getLoandata)
  .post([authCheck, , upload.single("image")], loanRequest)
router.get("/loancategories", authCheck, getloancategories)

//admin
//admin loancategories
router
  .route("/loancategories/admin")
  .get(authCheckAdmin, getloancategories)
  .post(authCheckAdmin, loancategories)

//admin getloanApplication
router.get("/loanrequestpendding", authCheckAdmin, loanApllicationPendding)
router.get("/loanrequestreject", authCheckAdmin, loanApllicationReject)
router.get("/loanrequestapproved", authCheckAdmin, loanApllicationApproved)
router.get("/loanrequestcomplete", authCheckAdmin, loanApllicationComplete)
router.get("/loanrequest", authCheckAdmin, getAllLoanApllication)

router
  .route("/loancategories/admin/:id")
  .delete(authCheckAdmin, deletedcategory)
  .put(authCheckAdmin, updatecategory);
//admin day status
router.patch("/admin/daystatus", authCheckAdmin,  dayStatusCon) 
//admin loan approved
router.patch("/admin/loanapproved/:id", authCheckAdmin, loanApproved);

export default router;
