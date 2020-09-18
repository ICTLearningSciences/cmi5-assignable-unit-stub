/*
Government Purpose Rights (“GPR”)
Contract No.  W911NF-14-D-0005
Contractor Name:   University of Southern California
Contractor Address:  3720 S. Flower Street, 3rd Floor, Los Angeles, CA 90089-0001
Expiration Date:  Restrictions do not expire, GPR is perpetual
Restrictions Notice/Marking: The Government's rights to use, modify, reproduce, release, perform, display, or disclose this software are restricted by paragraph (b)(2) of the Rights in Noncommercial Computer Software and Noncommercial Computer Software Documentation clause contained in the above identified contract.  No restrictions apply after the expiration date shown above. Any reproduction of the software or portions thereof marked with this legend must also reproduce the markings. (see: DFARS 252.227-7014(f)(2)) 

No Commercial Use: This software shall be used for government purposes only and shall not, without the express written permission of the party whose name appears in the restrictive legend, be used, modified, reproduced, released, performed, or displayed for any commercial purpose or disclosed to a person other than subcontractors, suppliers, or prospective subcontractors or suppliers, who require the software to submit offers for, or perform, government contracts.  Prior to disclosing the software, the Contractor shall require the persons to whom disclosure will be made to complete and sign the non-disclosure agreement at 227.7103-7.  (see DFARS 252.227-7025(b)(2))
*/
import { Agent, Extensions, Statement, Verb } from "@gradiant/xapi-dsl";
import axios from "axios";
import { LRS, newLrs } from "./xapi";

let _url = "";
let _cmi: Cmi5Service | null = null;

export interface HasVerb {
  verb: Verb;
}

export interface Cmi5Params {
  activityId: string;
  actor: Agent;
  endpoint: string;
  fetch: string;
  registration: string;
}

export interface Cmi5State {
  accessToken: string;
}

export interface Cmi5Service {
  readonly params: Cmi5Params;
  readonly state: Cmi5State;
  // readonly completed: (extensions?: Extensions) => Promise<void>;
  // readonly failed: (score: number, extensions?: Extensions) => Promise<void>;
  // readonly passed: (score: number, extensions?: Extensions) => Promise<void>;
  readonly start: () => Promise<void>;
  readonly terminate: () => Promise<void>;
}

export const VERB_COMPLETED = "http://adlnet.gov/expapi/verbs/completed";
export const VERB_FAILED = "http://adlnet.gov/expapi/verbs/failed";
export const VERB_INITIALIZED = "http://adlnet.gov/expapi/verbs/initialized";
export const VERB_PASSED = "http://adlnet.gov/expapi/verbs/passed";
export const VERB_TERMINATED = "http://adlnet.gov/expapi/verbs/terminated";

// export enum Cmi5Status {
//   NONE = "NONE",
//   START_IN_PROGRESS = "START_IN_PROGRESS",
//   STARTED = "STARTED",
//   START_FAILED = "START_FAILED",
//   COMPLETE_IN_PROGRESS = "COMPLETE_IN_PROGRESS",
//   COMPLETED = "COMPLETED",
//   COMPLETE_FAILED = "COMPLETE_FAILED",
//   TERMINATE_IN_PROGRESS = "TERMINATE_IN_PROGRESS",
//   TERMINATED = "TERMINATED",
//   TERMINATE_FAILED = "TERMINATE_FAILED",
// }

function hasCmi5Params(p: URLSearchParams): boolean {
  return Boolean(
    // true if has all required cmi5 query params
    p.get("fetch") &&
      p.get("endpoint") &&
      p.get("actor") &&
      p.get("registration") &&
      p.get("activityId")
  );
}

class _CmiService implements Cmi5Service {
  readonly params: Cmi5Params;
  _state: Cmi5State;
  _lrs: LRS | null = null;

  constructor(params: Cmi5Params) {
    this.params = params;
    this._state = {
      accessToken: "",
    };
  }

  get state(): Cmi5State {
    return this._state;
  }

  updateState(s: Cmi5State): void {
    this._state = s;
  }

  // async completed(extensions?: Extensions): Promise<void> {
  //   throw new Error("not implemented");
  // }

  // async failed(score: number, extensions?: Extensions): Promise<void> {
  //   throw new Error("not implemented");
  // }

  // async passed(score: number, extensions?: Extensions): Promise<void> {
  //   throw new Error("not implemented");
  // }

  async _authenticate(): Promise<void> {
    const res = await axios.post(this.params.fetch);
    const accessToken = res.data["auth-token"];
    if (!accessToken) {
      throw new Error(
        `invalid response from fetch ${this.params.fetch}: ${res.data}`
      );
    }
    const [username, password] = Buffer.from(accessToken, "base64")
      .toString("ascii")
      .split(":");
    this._lrs = newLrs({
      endpoint: this.params.endpoint,
      username,
      password,
    });
    this.updateState({
      ...this._state,
      accessToken,
    });
  }

  prepareActivityStatement(verb: string): Statement {
    return {
      actor: this.params.actor,
      context: {
        registration: this.params.registration,
      },
      object: {
        id: this.params.activityId,
      },
      verb: {
        id: verb,
      },
    };
  }

  async sendActivityStatement(verb: string): Promise<void> {
    this._lrs?.saveStatements([this.prepareActivityStatement(verb)]);
  }

  async start(): Promise<void> {
    await this._authenticate();
    await this.sendActivityStatement(VERB_INITIALIZED);
  }

  async terminate(): Promise<void> {
    await this.sendActivityStatement(VERB_TERMINATED);
  }
}

export class Cmi5 {
  static reset(): void {
    _cmi = null;
    _url = "";
  }

  static get isCmiAvailable(): boolean {
    if (Cmi5.exists) {
      console.log("already exists");
      return true;
    }
    if (!window || typeof window !== "object") {
      console.log("no window");
      return false;
    }
    if (!window.location || typeof window.location.search !== "string") {
      console.log("no window");
      return false;
    }
    return hasCmi5Params(new URLSearchParams(window.location.search));
  }

  static get url(): string {
    return _url || typeof window !== "undefined" ? window.location.href : "";
  }

  static get exists(): boolean {
    return _cmi ? true : false;
  }

  static get(url = ""): Cmi5Service {
    if (!_cmi) {
      _url = url || Cmi5.url;
      const p = new URLSearchParams(new URL(_url).search);
      if (!hasCmi5Params(p)) {
        throw new Error(`url does not have all required cmi5 params: ${_url}`);
      }
      _cmi = new _CmiService({
        actor: JSON.parse(`${p.get("actor")}`) as Agent,
        activityId: `${p.get("activityId")}`,
        endpoint: `${p.get("endpoint")}`,
        fetch: `${p.get("fetch")}`,
        registration: `${p.get("registration")}`,
      });
    }
    return _cmi;
  }
}
