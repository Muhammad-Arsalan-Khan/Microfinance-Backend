import mongoose from "mongoose"

const dayStatusSchema = new mongoose.Schema({
    location:{
    type : String,
    required: true,
    },
    date: {
        type: String,
        required: true, 
    },
    isOpen: {
        type: Boolean,
        default: true
    }
})

const dayStatus = mongoose.model("DayStatus", dayStatusSchema)

export default dayStatus