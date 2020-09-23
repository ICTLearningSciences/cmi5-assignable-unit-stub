import { useState } from "react";
import { Cmi5 } from "react-cmi5-context";

export const VERB_INITIALIZED = "http://adlnet.gov/expapi/verbs/initialized";
export const VERB_PASSED = "http://adlnet.gov/expapi/verbs/passed";
export const VERB_COMPLETED = "http://adlnet.gov/expapi/verbs/completed";
export const VERB_FAILED = "http://adlnet.gov/expapi/verbs/failed";
export const VERB_TERMINATED = "http://adlnet.gov/expapi/verbs/terminated";
export const AUTH_STATUS_NONE = "NONE";
export const AUTH_STATUS_IN_PROGRESS = "IN_PROGRESS";
export const AUTH_STATUS_SUCCESS = "SUCCESS";
export const AUTH_STATUS_FAILED = "FAILED";
export const ACTIVITY_STATUS_NONE = "NONE";
export const ACTIVITY_STATUS_IN_PROGRESS = "LOAD_IN_PROGRESS";
export const ACTIVITY_STATUS_SUCCESS = "LOADED";
export const ACTIVITY_STATUS_FAILED = "FAILED";

export function useCmi() {
  let cmi5: any = undefined;
  const [cmiState, setCmiState] = useState<any>({
    start: undefined,
    statements: [],
    authStatus: "",
    accessToken: "",
    activityStatus: "",
    lmsLaunchData: {},
  });

  async function start() {
    try {
      cmi5 = Cmi5.get();
      await cmi5.start();
    } catch (e) {
      console.error(`cmi5 start failed: ${e}`);
    }
    setCmiState({ ...cmi5.state });
  }

  async function passed(
    score: number,
    contextExtensions = {},
    resultExtensions = {}
  ) {
    try {
      cmi5 = Cmi5.get();
      await cmi5.passed({ score, contextExtensions, resultExtensions });
    } catch (e) {
      console.error(`cmi5 passed failed: ${e}`);
    }
    setCmiState({ ...cmi5.state });
  }

  async function failed(
    score: number,
    contextExtensions = {},
    resultExtensions = {}
  ) {
    try {
      cmi5 = Cmi5.get();
      await cmi5.failed({ score, contextExtensions, resultExtensions });
    } catch (e) {
      console.error(`cmi5 failed failed: ${e}`);
    }
    setCmiState({ ...cmi5.state });
  }

  async function completed(extensions = {}) {
    try {
      cmi5 = Cmi5.get();
      await cmi5.completed({ extensions });
    } catch (e) {
      console.error(`cmi5 completed failed: ${e}`);
    }
    setCmiState({ ...cmi5.state });
  }

  async function terminate() {
    try {
      cmi5 = Cmi5.get();
      await cmi5.terminate();
    } catch (e) {
      console.error(`cmi5 terminate failed: ${e}`);
    }
    setCmiState({ ...cmi5.state });
  }

  return [cmiState, start, passed, failed, completed, terminate];
}

export default useCmi;
