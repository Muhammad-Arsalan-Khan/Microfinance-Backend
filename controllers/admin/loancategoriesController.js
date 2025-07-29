import LoanCategory from "../../models/loanCategorySchema.js";

const loancategories = async (req, res) => {
  try {
    const { category, subcategory, maxAmount, loanPeriod } = req.body
    const data = { category, subcategory, maxAmount, loanPeriod }
    const saved = await LoanCategory.create(data)
    console.log("saved loan categories", saved)
    res.status(200).json(saved)
  } catch (err) {
    console.error("Error saving loan categories:", err)
    res.status(500).json({ error: err.message })
  }
};

const deletedcategory = async (req, res) => {
  const categoryId = req.params.id
  try {
    const deletedcategory = await LoanCategory.findByIdAndDelete(categoryId)

    if (!deletedcategory) {
      return res.status(404).json({ message: "category not found" })
    }

    return res.status(200).json({
      message: "category deleted successfully",
      deletedcategory: deletedcategory,
    })
  } catch (err) {
    console.error("error deleting category", err, err.message, err.code)
    return res.status(500).json({
      message: "something went wrong while deleting the category",
      error: err.message,
    });
  }
};

async function updatecategory(req, res) {
  const categoryId = req.params.id
  try {
    const { category, subcategory, maxAmount, loanPeriod } = req.body
    if (!categoryId) {
      return res.status(400).json({ message: "category id is required" })
    }
    const UpdatedCategory = await LoanCategory.findByIdAndUpdate(
      categoryId,
      {
        category,
        subcategory,
        maxAmount,
        loanPeriod,
      },
      { new: true }
    )
    if (!UpdatedCategory) {
      return res.status(404).json({ message: "category not found" })
    }
    console.log("category update successfully", UpdatedCategory)
    return res.status(201).json({
      message: "category update successfully",
      updateCat: UpdatedCategory,
    })
  } catch (err) {
    console.error("Error updating category:", err, err.message, err.code)
    return res.status(500).json({
      message: "Something went wrong while updating the category",
      error: err.message,
    });
  }
}

async function getloancategories(req, res) {
  try {
    const response = await LoanCategory.find()
    return res.json({msg: "all loan categoray ", data : response})
  } catch (error) {
    console.error("Error getting category:", err, err.message, err.code)
    return res.status(500).json({
      message: "Something went wrong while getting the category",
      error: err.message,
    });
  }
}

export { deletedcategory, loancategories, updatecategory, getloancategories }
