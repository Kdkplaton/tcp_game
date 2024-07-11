import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';

export const onConnection = (socket) => {
  console.log('클라이언트 연결됨:', socket.remoteAddress, socket.remotePort);

  // 각 클라이언트에 고유한 버퍼를 유지
  socket.buffer = Buffer.alloc(0);

  socket.on('data', onData(socket));

  socket.on('end', onEnd(socket));

  socket.on('error', onError(socket));
};
