import { addDays, format, getDay } from 'date-fns';
import Appointment from '../models/Appointment.js';
import DayStatus from '../models/DayStatusSchema.js';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const CAMPUS = "HeadOffice";
const MAX_LOOKAHEAD_DAYS = 30; // safety limit to prevent infinite loop

export const generateAppointment = async () => {
  for (let i = 0; i <= MAX_LOOKAHEAD_DAYS; i++) {
    const currentDate = addDays(new Date(), i);
    const dayOfWeek = getDay(currentDate); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0) continue; // Skip Sunday

    const dateStr = format(currentDate, 'dd-MM-yyyy');

    // Check if the day is CLOSED by admin
    const isClosed = await DayStatus.exists({
      location: CAMPUS,
      date: dateStr,
      isOpen: false,
    });

    if (isClosed) continue;
    
    //console.log('Looking for appointments on:', dateStr);
    // Check how many slots already booked
    const appointments = await Appointment.find({ location: CAMPUS, date: dateStr }); //date: { $regex: '18-07-2025' }
    //console.log('Appointments found:', appointments);

    if (appointments.length >= TIME_SLOTS.length) continue;

    const usedSlots = new Set(appointments.map(a => a.timeSlot.trim()));
    //console.log("usedslots",usedSlots)
    const freeSlot = TIME_SLOTS.find(slot => !usedSlots.has(slot));
    //console.log("free slot",freeSlot)

    if (!freeSlot) continue;

    // Found a free slot, book it!
    const appointment = await Appointment.create({
      location: CAMPUS,
      date: dateStr,
      timeSlot: freeSlot,
    });

    return { success: true, appointment };
  }

  // Even after MAX_LOOKAHEAD_DAYS no slot found (very rare)
  return {
    success: false,
    message: 'No available slots found in this month',
  };
};

