import mongoose from 'mongoose'

const guarantorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    // required: true,
    trim: true
  },
  cnic: {
    type: String,
    required: true,
    length: 13
  },
  location: {
    type: String,
    required: true
  }
}, { _id: false })

const loanRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userCnic:{
    type: String,
    required: true,
    length: 13
  },
  userEmail:{
    type: String,
    //required: true,
    trim: true
  },
  email: {
    type: String,
    //required: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },

  subCategory: {
    type: String,
    required: true
  },

  requestedAmount: {
    type: Number,
    required: true
  },

  initialPayment: {
    type: Number,
    required: true
  },

  durationMonths: {
    type: Number,
    required: true
  },

  monthlyInstallment: {
    type: Number, 
    required: true
  },

  guarantors: {
    type: [guarantorSchema],
    validate: {
      validator: function (value) {
        if (value.length !== 2) return false;
        const [g1, g2] = value;
        return g1.cnic !== g2.cnic;
      },
      message: 'there must be exactly 2 guarantors with different CNIC'
    }
  },

  salarySlipURL: {
    type: String,
    default: '',
    // required: true
  },

  token: {
    type: String,
    default: '',
    unique: true,
    required: true
  },

  qrCodeURL: {
    type: String,
    required: true,
    default:'',
  },

  appointmentDate: {
    type: String,
    required: true,
    default: '',
  },
  appointmentLocation:{
    type: String,
    required: true,
    default: '',
  },

  appointmentTime: {
    type: String, // e.g. "11:30 AM"
    required: true,
    default: '',
  },

  loanStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'completed'],
    default: 'Pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});


const LoanRequest = mongoose.model("LoanRequest", loanRequestSchema);

export default LoanRequest


