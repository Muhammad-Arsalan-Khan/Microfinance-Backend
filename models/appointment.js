import mongoose from "mongoose"


const appointmentSchema = new mongoose.Schema({
    location:{
    type : String,
    required: true,
    },
    date: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true
    }
})

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment
