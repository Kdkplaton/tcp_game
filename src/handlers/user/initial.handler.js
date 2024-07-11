// handlerId, userId, clientVersion, sequence, payload

import { addUser } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId } = payload;

    // 존재하는 유저가 아니라면 새로 생성 / 존재하는 유저면 로그인기록 업데이트
    let user = await findUserByDeviceID(deviceId);
    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }

    // DB가 아닌 세션에 유저 새로 생성
    addUser(socket, user.id);

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: user.id },
      deviceId,
    );

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error)
  }
};

export default initialHandler;
