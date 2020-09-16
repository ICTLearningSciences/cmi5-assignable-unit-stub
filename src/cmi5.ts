/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 

No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
import { Statement, Verb } from "@gradiant/xapi-dsl";

let _url = "";
let _cmi: Cmi5Spi | null = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface CallbackFunc<T> {
  (err: Error | null, result?: T): void;
}

export interface HasVerb {
  verb: Verb;
}

interface Cmi5Spi {
  completed: (extensions: any, cb: CallbackFunc<void>) => void;
  failed: (score: number, extensions: any, cb: CallbackFunc<void>) => void;
  passed: (score: number, extensions: any, cb: CallbackFunc<void>) => void;
  prepareStatement: (st: HasVerb) => Statement;
  sendStatement: (st: Statement, cb: CallbackFunc<void>) => void;
  start: (cb: CallbackFunc<void>) => void;
  terminate: (cb: CallbackFunc<void>) => void;
}

export enum Cmi5Status {
  NONE = 0,
  START_IN_PROGRESS,
  STARTED,
  START_FAILED,
  COMPLETE_IN_PROGRESS,
  COMPLETED,
  COMPLETE_FAILED,
  TERMINATE_IN_PROGRESS,
  TERMINATED,
  TERMINATE_FAILED,
}

/**
 * Singleton wrapper for a cmi service.
 */
class Cmi5 {
  /**
   * Cmi is only available if the required query params are on the url string
   */
  static get isCmiAvailable(): boolean {
    if (Cmi5.instanceExists) {
      return true;
    }
    if (!window || typeof window !== "object") {
      return false;
    }
    if (!window.location || typeof window.location.search !== "string") {
      return false;
    }
    const p = new URLSearchParams(window.location.search);
    return Boolean(
      // true if has all required cmi5 query params
      p.get("fetch") &&
        p.get("endpoint") &&
        p.get("actor") &&
        p.get("registration") &&
        p.get("activityId")
    );
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
  ): Promise<Cmi5Spi> {
    return new Promise((resolve, reject) => {
      if (
        typeof window !== "undefined" &&
        typeof window["Cmi5"] === "function"
      ) {
        _cmi = new window["Cmi5"](Cmi5.url) as Cmi5Spi;
        return resolve(_cmi);
      }
      if (timerMs >= timeoutMs) {
        return reject(
          `Cmi5 timeout: failed to create a Cmi5 instance in ${timeoutMs} (constructor not loaded on window)`
        );
      }
      sleep(retryIntervalMs)
        .then(() =>
          Cmi5._tryCreateWithTimeout(
            timeoutMs,
            retryIntervalMs,
            timerMs + retryIntervalMs
          )
        )
        .then((cmi) => resolve(cmi))
        .catch((err) => reject(err));
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
  static create(url = ""): Promise<Cmi5Spi> {
    _url = url || Cmi5.url;
    const timeoutMs = 5000;
    const retryIntervalMs = 250;
    return this._tryCreateWithTimeout(timeoutMs, retryIntervalMs, 0);
  }

  static get url(): string {
    return _url || typeof window !== "undefined" ? window.location.href : "";
  }

  static set url(value) {
    _url = value;
  }

  static get instanceExists(): boolean {
    return _cmi ? true : false;
  }

  static get instance(): Promise<Cmi5Spi> {
    if (_cmi) {
      return Promise.resolve(_cmi);
    }
    return Cmi5.create();
  }
}

export default Cmi5;
