
const mapHelperVerificationStatus = (helper) => {
  if (!helper) {
    return helper;
  }

  const helperData = helper.toObject
    ? helper.toObject()
    : { ...helper };

  if (helperData.verificationStatus === "rejected") {
    helperData.verificationStatus = "pending";
  }

  return helperData;
};

module.exports = mapHelperVerificationStatus;
