// loanCategorySchema.js
import mongoose from "mongoose";

const loanCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  subcategory:{
    type: Array,
    required: true,
  },
  maxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  loanPeriod:{
    type: Number,
    required: true,
    min: 0
  }
});

const LoanCategory = mongoose.model("LoanCategory", loanCategorySchema);
export default LoanCategory;
