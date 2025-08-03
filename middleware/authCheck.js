import { verifyUser } from "../utils/jwt.js"
import User from "../models/userSchema.js"

export const authCheck = async (req, res, next) => {
    try {
         const token = req.headers.authorization.split(" ")[1]
        //  console.log("token",token)
         const userData = verifyUser(token)
        //  console.log("userData",userData)
         if (!userData) {
            return res.status(401).json({ message: "invalid token" })
          }
        if (userData?.userId) {
            // console.log("id",userData.userId)
            req.user = userData
            next()
        } else {
            res.status(401).json({
                message: "unAuthorization user"
            })
        }
    } catch (error) {
        res.json({
            message: "catch unAuthorization user"
        })
    }

}

export const authCheckAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const isVerify = verifyUser(token)
         if (!isVerify) {
            return res.status(401).json({ message: "invalid token" })
          }

        if (isVerify?.userId) {
            const user = await User.findById(isVerify.userId)

            if (!user.isAdmin) {
                return res.json({
                message: "only admin can access this API",
                status: false,
               })
             }

            req.user = isVerify 
            next()
        } else {
            res.status(401).json({
                message: "unAuthorization user"
            })
        }
    } catch (error) {
        res.status(401).json({
            message: "unAuthorization user"
        })
    }

}




// import { verifyUser } from "../utils/jwt.js"
// import User from "../models/userSchema.js"
// async function authCheck(req, res, next) {
//   const token = req.cookies?.token
//   if (!token) {
//     return res.status(401).json({ message: " unauthorized access " })
//   }
//   const userData = verifyUser(token)
//   if (!userData) {
//     return res.status(401).json({ message: "invalid token" })
//   }
//   req.user = userData
//   next()
// }
// async function authCheckAdmin(req, res, next) {
//   try {
//     const token = req.cookies?.token
//     if (!token) {
//       return res.status(401).json({ message: "unauthorized access" })
//     }
//     const isVerify = verifyUser(token)
//     if (isVerify?.userId) {
//       const user = await User.findById(isVerify.userId)
//       if (!user.isAdmin) {
//         return res.json({
//           message: "only admin can access this API",
//           status: false,
//         });
//       }
//       req.user = isVerify
//       next()
//     } else {
//       res.json({
//         message: "unAuthorization user",
//       });
//     }
//   } catch (error) {
//     res.json({
//       message: "unAuthorization user",
//     });
//   }
// }
// export { authCheck, authCheckAdmin }
