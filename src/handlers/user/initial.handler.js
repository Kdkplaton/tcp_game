// handlerId, userId, clientVersion, sequence, payload

import { addUser } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getGameSession } from '../../session/game.session.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId, latency, playerId } = payload;
    console.log( 'addUser 직전:', deviceId, latency, playerId );

    // 유저 신규 생성
    const user = addUser(socket, deviceId, playerId, latency);
    
    // 게임 세션에 유저 등록
    const gameSession = getGameSession();
    gameSession.addUser(user); 

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL, RESPONSE_SUCCESS_CODE,
      {
        userId: deviceId,
      },
    ); 

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error)
  }
};

export default initialHandler;
