const { default: mongoose } = require("mongoose");
const ScriptLogSchema = new mongoose.Schema(
  {
    DayDeployed: {
      type: Date,
      default: null,
    },
    ScriptDeployed: {
      type: String,
      default: null,
    },
    BaseDeployed: {
      type: String,
      default: null,
    },
    Type: {
      type: String,
      default: "Deploy",
    },
    Status: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "ScriptLog",
  }
);

const ScriptLog = mongoose.model("ScriptLog", ScriptLogSchema);

module.exports = {
  ScriptLog,
};
