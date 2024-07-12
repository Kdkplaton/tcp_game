import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

export const addGameSession = (id) => {
  const session = new Game(id);
  gameSessions.push(session);
  return session;
};

export const removeGameSession = (id) => {
  delete gameSessions[0];
};

export const getGameSession = () => {
  return gameSessions[0];
};

export const getAllGameSessions = () => {
  return gameSessions;
};
