var mongoose = require("mongoose");

const ProductDetailsSchema = {
  itemCategory: [
    {
      category: { type: String, required: false },
      discount: { type: String, required: false },
    },
  ],
  individualItems: [
    {
      itemName: { type: String, required: false },
      dicount: { type: String, required: false },
      itemPrice: { type: String, required: false },
    },
  ],
};

// const Agent = mongoose.model('happyHourSlot', happyHourSlotSchema);

var happyHourSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: false },
    address: { type: String, required: false },
    status: { type: String, required: false },
    happyHourDetails: {
      type: { type: String, required: true },
      value: [
        {
          day: { type: String, required: false },
          startTime: { type: String, required: false },
          endTime: { type: String, required: false },
        },
      ],
      startDate: { type: String, required: false },
      endDate: { type: String, required: false },
      startTime: { type: String, required: false },
      endTime: { type: String, required: false },
      ProductDetails: [ProductDetailsSchema],
    },
  },
  {
    collection: "happyHour",
    timestamps: false,
  }
);

const User = mongoose.model("happyHour", happyHourSchema);

module.exports = User;
