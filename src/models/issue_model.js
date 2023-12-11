import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  issue: { type: String, required: true },
});

issueSchema.statics.fromJSON = async function (json) {
  const { issue, phone } = json;
  let issueObj = await this.findOne({ issue });

  if (issueObj==null) {
    issueObj = await this.create(json);
  } 

  return issueObj;
};

const IssueModel = mongoose.model("IssueModel", issueSchema);

export { IssueModel };