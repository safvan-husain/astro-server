import mongoose, { Schema } from "mongoose";

const callScheduleSchema = new Schema({
  astroId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  astroName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  callState: {
    type: String,
    enum: ["completed", "requested", "sheduled", "none"],
    default: "none",
  },
  dateTime: { 
    type: Date,
    default: Date.now,
  },
  isSend: {
    type: Boolean,
    default: false,
  },
});

callScheduleSchema.statics.createFromJson = function(json, isSend) {
  const data = JSON.parse(json);
  return this.findOneAndUpdate(
    { astroId: data.astroId,userId: data.userId, dateTime: new Date(data.dateTime),astroName: data.astroName, userName: data.userName }, // find a document with same astroId and dateTime
    {
      callState: data.callState,
      isSend: isSend,
    }, // update these fields
    {
      new: true, // return the new document
      upsert: true, // create a new document if no documents match the filter
    }
  );
};

const CallSchedule = mongoose.model("CallSchedule", callScheduleSchema);

export { CallSchedule };