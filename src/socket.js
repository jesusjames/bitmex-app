const URL = "wss://ws.bitmex.com/realtime?subscribe=instrument,orderBookL2_25:XBTUSD";
const socket = new WebSocket(URL);

export default socket;
