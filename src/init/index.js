// 서버 초기화 작업
import { loadProtos } from './loadProtos.js';
import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../session/game.session.js';

const initServer = async () => {
  try {
    await loadProtos();
    const gameId = uuidv4();
    const gameSession = addGameSession(gameId);;

  } catch (e) {
    console.error(e);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
