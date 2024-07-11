// 기본 매니저

class BaseManager {
  constructor() {
    if (new.target === BaseManager) {
      throw new TypeError('Cannot construct instances directly');
    }
  }

  addPlayer(playerId, ...args) {
    throw new Error('Must implement addPlayer method');
  }

  removePlayer(playerId) {
    throw new Error('Must implement removePlayer method');
  }

  clearAll() {
    throw new Error('Must implement clearAll method');
  }
}

export default BaseManager;
