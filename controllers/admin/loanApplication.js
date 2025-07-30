import LoanRequest from "../../models/loanSchema.js"

async function getAllLoanApllication(req, res){
   try {
    const response = await LoanRequest.find()
    return res.json({msg: "all loan application ", data : response})
  } catch (error) {
    console.error("Error getting loan application:", err, err.message, err.code)
    return res.status(500).json({
      message: "Something went wrong while getting the loan application",
      error: err.message,
    })
  }
}

async function loanApllicationPendding(req, res){
   try {
    const response = await LoanRequest.find({loanStatus: "Pending"}) 
    return res.json({msg: "all pendding loan application ", data : response})
  } catch (error) {
    console.error("Error getting pendding loan application:", err, err.message, err.code)
    return res.status(500).json({
      message: "Something went wrong while getting pendding the loan application",
      error: err.message,
    })
  }
}

async function loanApllicationReject(req, res){
   try {
    const response = await LoanRequest.find({loanStatus: "Rejected"})
    return res.json({msg: "all rejected loan application ", data : response})
  } catch (error) {
    console.error("Error getting rejected loan application:", err, err.message, err.code)
    return res.status(500).json({
      message: "Something went wrong while getting the rejected loan application",
      error: err.message,
    })
  }
}

async function loanApllicationApproved(req, res){
   try {
    const response = await LoanRequest.find({loanStatus: "Approved"})
    return res.json({msg: "all approved loan application ", data : response})
  } catch (error) {
    console.error("Error getting approved loan application:", err, err.message, err.code)
    return res.status(500).json({
      message: "Something went wrong while getting the approved loan application",
      error: err.message,
    })
  }
}

async function loanApllicationComplete(req, res){
   try {
    const response = await LoanRequest.find({loanStatus: "completed"})
    return res.json({msg: "all complete loan application ", data : response})
  } catch (error) {
    console.error("Error getting completedLoan application:", err, err.message, err.code)
    return res.status(500).json({
      message: "Something went wrong while getting the completedLoan application",
      error: err.message,
    })
  }
}

export {
getAllLoanApllication,
loanApllicationApproved,
loanApllicationComplete,
loanApllicationPendding,
loanApllicationReject
}