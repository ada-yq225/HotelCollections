export function getWeChatWorkUrl() {
  return process.env.WECHAT_WORK_URL || "https://work.weixin.qq.com/";
}

export function getBookingContactHint() {
  return process.env.BOOKING_CONTACT_HINT || "添加 H&C 专属旅行顾问，享前台现付礼遇";
}