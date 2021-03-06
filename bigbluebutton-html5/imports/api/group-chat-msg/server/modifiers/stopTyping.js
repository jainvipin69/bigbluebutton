import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import { UsersTyping } from '/imports/api/group-chat-msg';

export default function stopTyping(meetingId, userId, sendMsgInitiated = false) {
  check(meetingId, String);
  check(userId, String);
  check(sendMsgInitiated, Boolean);

  const selector = {
    meetingId,
    userId,
  };

  const user = UsersTyping.findOne(selector);
  const stillTyping = !sendMsgInitiated && user && (new Date()) - user.time < 3000;
  if (stillTyping) return;

  const cb = (err) => {
    if (err) {
      return Logger.error(`Stop user=${userId} typing indicator error: ${err}`);
    }
    return Logger.debug(`Stopped typing indicator for user=${userId}`);
  };

  UsersTyping.remove(selector, cb);
}
