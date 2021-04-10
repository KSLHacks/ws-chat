import * as moment from 'moment';

interface ChatMessage {
  username: string;
  text: string;
  time: string;
}

export function formatMessage(username: string, text: string): ChatMessage {
  return {
    username,
    text,
    time: moment().format('h:mm:ss a'),
  };
}
