import LoanRequest from "../../models/loanSchema.js"
import User from "../../models/userSchema.js"

async function loanApproved(req, res) {
  try {
    const user = req.params.id
    if (!user) {
      return res.status(400).json({ msg: "user id is required" })
    }
    const { loanStatus } = req.body;
    const updateloan = await LoanRequest.findByIdAndUpdate(
      user,
      {
        loanStatus,
      },
      { new: true }
    )
    if (!updateloan) {
      return res.status(404).json({ message: "loan not found" })
    }
    if (loanStatus === "Approved") {
      const response = await User.findByIdAndUpdate(
        updateloan.user,
        { $push: { loanId: updateloan._id } },
        { new: true }
      )
    }
    if (loanStatus == "Rejected") {
      const response = await User.findByIdAndUpdate(
        updateloan.user,
        {
          $pull: { loanId: updateloan._id },
        },
        { new: true }
      )
    }
    if (loanStatus == "completed") {
      const response = await User.findByIdAndUpdate(
        updateloan.user,
        {
          $pull: { loanId: updateloan._id },
          $push: { loanCompleted: updateloan._id },
        },
        { new: true }
      );
    }
    return res.status(200).json({
      message: "loan update successfully",
      updateloan: updateloan,
    });
  } catch (err) {
    console.error("error in loanApproved controller:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export { loanApproved }
