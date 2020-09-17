import { Agent } from "@gradiant/xapi-dsl";
import xhrMock from "xhr-mock";

export interface Cmi5HelperParams {
  activityId: string;
  actor: Agent;
  endpoint: string;
  fetch: string;
  registration: string;
  urlBase: string;
}

export const DEFAULT_CMI5_PARAMS: Cmi5HelperParams = {
  activityId: "http://localhost/activity-id",
  actor: {
    name: "default-actor",
    objectType: "Agent",
    account: {
      homePage: "http://localhost/users",
      name: "default-actor",
    },
  },
  endpoint: "http://localhost/xapi",
  fetch: "http://localhost/fetch",
  registration: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  urlBase: "http://localhost",
};

const _setWindowLocation = (newLocation: URL | Location) => {
  delete (window as any).location;
  (window as any).location = newLocation;
};

export class MockCmi5Helper implements Cmi5HelperParams {
  activityId = DEFAULT_CMI5_PARAMS.activityId;
  actor: Agent = DEFAULT_CMI5_PARAMS.actor;
  endpoint = DEFAULT_CMI5_PARAMS.endpoint;
  fetch = DEFAULT_CMI5_PARAMS.fetch;
  registration = DEFAULT_CMI5_PARAMS.registration;
  urlBase = DEFAULT_CMI5_PARAMS.urlBase;
  locationOriginal?: Location;
  _isMockSetup = false;

  constructor(params: Partial<Cmi5HelperParams> = {}) {
    this.activityId = params.activityId || this.activityId;
    this.actor = params.actor || this.actor;
    this.endpoint = params.endpoint || this.endpoint;
    this.fetch = params.fetch || this.fetch;
    this.registration = params.registration || this.registration;
    this.urlBase = params.urlBase || this.urlBase;
    this.locationOriginal = window.location;
  }

  get search(): URLSearchParams {
    return new URLSearchParams({
      activityId: this.activityId,
      actor: JSON.stringify(this.actor),
      endpoint: this.endpoint,
      fetch: this.fetch,
      registration: this.registration,
    });
  }

  get url(): URL {
    return new URL(`${this.urlBase}?${this.search.toString()}`);
  }

  mockLocation(): void {
    _setWindowLocation(this.url);
  }

  _ensureXhrMocked(): void {
    if (!this._isMockSetup) {
      xhrMock.setup();
      this._isMockSetup = true;
    }
  }

  mockFetch(): void {
    this._ensureXhrMocked();
    xhrMock.post(this.fetch, {
      status: 200,
      body: {
        "auth-token": "fake-auth-token",
      },
    });
  }

  restore(): void {
    if (this.locationOriginal) {
      _setWindowLocation(this.locationOriginal);
    }
    if (this._isMockSetup) {
      xhrMock.teardown();
      this._isMockSetup = false;
    }
  }
}
