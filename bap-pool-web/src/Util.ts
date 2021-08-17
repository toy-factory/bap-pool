const Util = {
  getRandomId: () => Math.random().toString(36).substr(2, 9),
  shuffleArray: <T>(array: Array<T>) => {
    const arr = array.slice();
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
};

export default Util;
