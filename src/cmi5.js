let _url = null;
let _cmi = null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Singleton wrapper for a cmi service.
 */
class Cmi5 {
  static get STATUS() {
    return {
      NONE: 0,
      START_IN_PROGRESS: 1,
      STARTED: 2,
      START_FAILED: 3,
      COMPLETE_IN_PROGRESS: 4,
      COMPLETED: 5,
      COMPLETE_FAILED: 6,
      TERMINATE_IN_PROGRESS: 6,
      TERMINATED: 7,
      TERMINATE_FAILED: 8,
    };
  }

  /**
   * Cmi is only available if the required query params are on the url string
   */
  static get isCmiAvailable() {
    if (Cmi5.instanceExists) {
      return true;
    }
    if (!window || typeof window !== 'object') {
      return false;
    }
    if (!window.location || typeof window.location.search !== 'string') {
      return false;
    }
    const p = new URLSearchParams(window.location.search);
    return Boolean(
      // true if has all required cmi5 query params
      p.get('fetch') && p.get('endpoint') && p.get('actor') && p.get('registration') && p.get('activityId')
    );
  }

  static get STATUS_PROP() {
    return 'cmi5_status';
  }

  static getStatus(state) {
    return state
      ? state[Cmi5.STATUS_PROP] || Cmi5.STATUS.NONE
      : Cmi5.STATUS.NONE;
  }

  static setStatus(state, status = Cmi5.STATUS.NONE) {
    state = state || {};
    return {
      ...state,
      [Cmi5.STATUS_PROP]: status,
    };
  }

  /**
   * Try to create an instance of the Cmi5 class downloaded from the script lib.
   * Since the lib may take some time to download, typically safer/easier
   * to wait and retry if the class is not yet set on `window.Cmi5`
   *
   * @param {Number} timeoutMs
   * @param {Number} retryIntervalMs
   * @param {Number} timerMs
   */
  static _tryCreateWithTimeout(
    timeoutMs = 20000,
    retryIntervalMs = 250,
    timerMs = 0
  ) {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && typeof window.Cmi5 === 'function') {
        _cmi = new window.Cmi5(Cmi5.url);
        return resolve(_cmi);
      }
      if (timerMs >= timeoutMs) {
        return reject(
          `Cmi5 timeout: failed to create a Cmi5 instance in ${timeoutMs} (constructor not loaded on window)`
        );
      }
      sleep(retryIntervalMs)
        .then(_ =>
          Cmi5._tryCreateWithTimeout(
            timeoutMs,
            retryIntervalMs,
            timerMs + retryIntervalMs
          )
        )
        .then(cmi => resolve(cmi))
        .catch(err => reject(err));
    });
  }

  /**
   * Create an instance of the Cmi5 class downloaded from the script lib.
   * Since the lib may take some time to download, typically safer/easier
   * to wait and retry if the class is not yet set on `window.Cmi5`
   *
   * If you want to use the return type, you need to extract it from the promise, e.g.
   *
   * `const cmi = await Cmi5.create(myUrl);`
   *
   * or
   *
   * `Cmi5.create(myUrl).then(cmi => // do something w cmi obj)`
   *
   * @returns {Promise} that resolves an instance of (downloaded) Cmi5 class (which is not the same as this class)
   */
  static create(url) {
    _url = url || Cmi5.url;
    const timeoutMs = 5000;
    const retryIntervalMs = 250;
    return this._tryCreateWithTimeout(timeoutMs, retryIntervalMs, 0);
  }

  static get url() {
    return _url || typeof window !== 'undefined' ? window.location.href : null;
  }

  static set url(value) {
    _url = value;
  }

  static get instanceExists() {
    return _cmi ? true : false;
  }

  static get instance() {
    if (_cmi) {
      return _cmi;
    }
    try {
      return Cmi5.create();
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

export default Cmi5;
