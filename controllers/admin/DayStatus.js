import DayStatus from "../../models/DayStatusSchema.js"

export async function dayStatusCon(req, res) {
  try {
    const { location, date, isOpen } = req.body
    const data = { location, date, isOpen }
    const isClosed = await DayStatus.create(data)
    res.json({ msg: "day status updated", isClosed })
  } catch (error) {
    console.log(error, error.message, error.code)
    res.status(500).json({ msg: "error day status" })
  }
}

