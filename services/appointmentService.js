import { addDays, format, getDay } from 'date-fns'
import Appointment from '../models/Appointment.js'
import DayStatus from '../models/DayStatusSchema.js'

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const CAMPUS = "HeadOffice"
const MAX_LOOKAHEAD_DAYS = 30

export const generateAppointment = async () => {
  for (let i = 0; i <= MAX_LOOKAHEAD_DAYS; i++) {
    const currentDate = addDays(new Date(), i);
    const dayOfWeek = getDay(currentDate)

    if (dayOfWeek === 0) continue 

    const dateStr = format(currentDate, 'dd-MM-yyyy');

    const isClosed = await DayStatus.exists({
      location: CAMPUS,
      date: dateStr,
      isOpen: false,
    });

    if (isClosed) continue;
    
    const appointments = await Appointment.find({ location: CAMPUS, date: dateStr })

    if (appointments.length >= TIME_SLOTS.length) continue

    const usedSlots = new Set(appointments.map(a => a.timeSlot.trim()))
    const freeSlot = TIME_SLOTS.find(slot => !usedSlots.has(slot));
  
    if (!freeSlot) continue;

    const appointment = await Appointment.create({
      location: CAMPUS,
      date: dateStr,
      timeSlot: freeSlot,
    });

    return { success: true, appointment }
  }

  return {
    success: false,
    message: 'no available slots found in this month',
  }
}

