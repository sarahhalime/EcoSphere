import SendBird from 'sendbird';

const APP_ID = import.meta.env.VITE_SENDBIRD_APP_ID

export const sb = new SendBird({ appId: APP_ID });