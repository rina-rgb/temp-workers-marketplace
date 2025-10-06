export const CANCELLATION_MODAL_TEXT = {
  dialogTitle: "Cancel Shift",
  confirmationMessage: "Are you sure you want to cancel this shift?",
  lastMinuteWarning: {
    title: "⚠️ Last-Minute Cancellation Notice",
    message: (minHours: number, contactName: string, contactNumber: string) =>
      `This shift requires ${minHours} hours advance notice. Your cancellation request will be sent to ${contactName} and you must call them at ${contactNumber}.`,
  },
  immediateInfo: "This shift can be cancelled immediately with no advance notice required.",
  shiftDetails: {
    title: "Shift Details:",
    location: (location: string) => `• Location: ${location}`,
    time: (date: string, startTime: string, endTime: string) => 
      `• Time: ${date} ${startTime} - ${endTime}`,
  },
  reasonField: {
    label: "Reason for cancellation",
    placeholder: "Please provide a reason for cancelling this shift...",
  },
  buttons: {
    keep: "Keep Shift",
    cancelImmediate: "Cancel Immediately",
    cancelImmediateLoading: "Cancelling...",
    sendRequest: "Send Cancellation Request",
    sendRequestLoading: "Sending Request...",
  },
};