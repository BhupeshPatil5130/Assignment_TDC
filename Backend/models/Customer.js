const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    height: { type: Number, required: true }, 
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    college: { type: String },
    degree: { type: String },
    income: { type: Number, required: true }, 
    company: { type: String },
    designation: { type: String },

    maritalStatus: {
      type: String,
      enum: ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"],
      required: true,
    },
    languages: [{ type: String }],
    siblings: { type: Number, default: 0 },
    caste: { type: String },
    religion: { type: String },

    wantKids: { type: String, enum: ["Yes", "No", "Maybe"], required: true },
    openToRelocate: {
      type: String,
      enum: ["Yes", "No", "Maybe"],
      required: true,
    },
    openToPets: { type: String, enum: ["Yes", "No", "Maybe"], required: true },

    diet: {
      type: String,
      enum: ["Veg", "Non-Veg", "Jain", "Vegan", "Eggetarian"],
    },
    smoking: { type: String, enum: ["Yes", "No", "Occasionally"] },
    drinking: { type: String, enum: ["Yes", "No", "Occasionally"] },
    manglikStatus: {
      type: String,
      enum: ["Yes", "No", "Not Sure", "Anshik Manglik"],
    },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    statusTag: {
      type: String,
      enum: ["Active", "On Hold", "Matched", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

customerSchema.virtual("age").get(function () {
  if (!this.dob) return null;
  const ageDifMs = Date.now() - this.dob.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

module.exports = mongoose.model("Customer", customerSchema);
