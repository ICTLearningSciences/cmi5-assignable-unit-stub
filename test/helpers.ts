import { Agent } from "@gradiant/xapi-dsl";
// import xhrMock from "xhr-mock";
import { Cmi5, Cmi5Params } from "../src/cmi5";
import { newLrs } from "../src/xapi";
import MockAxios from "axios-mock-adapter";
import axios from "axios";
import * as xapi from "../src/xapi";
jest.mock("../src/xapi");

export const DEFAULT_ACCESS_TOKEN_USERNAME = "testuser";
export const DEFAULT_ACCESS_TOKEN_PASSWORD = "testpassword";
export const DEFAULT_CMI5_PARAMS: Cmi5Params = {
  activityId: "http://example.com/activity-id",
  actor: {
    name: DEFAULT_ACCESS_TOKEN_USERNAME,
    objectType: "Agent",
    account: {
      homePage: "http://example.com/users",
      name: DEFAULT_ACCESS_TOKEN_PASSWORD,
    },
  },
  endpoint: "http://example.com/xapi",
  fetch: "/fetch",
  registration: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
};

export const DEFAULT_URL_BASE = "http://example.com";

const _setWindowLocation = (newLocation: URL | Location) => {
  delete (window as any).location;
  (window as any).location = newLocation;
};

export type MockCmi5HelperParams = Partial<Cmi5Params & { urlBase: string }>;

export class MockCmi5Helper {
  accessTokenPassword = DEFAULT_ACCESS_TOKEN_PASSWORD;
  accessTokenUsername = DEFAULT_ACCESS_TOKEN_USERNAME;
  activityId = DEFAULT_CMI5_PARAMS.activityId;
  actor: Agent = DEFAULT_CMI5_PARAMS.actor;
  endpoint = DEFAULT_CMI5_PARAMS.endpoint;
  fetch = DEFAULT_CMI5_PARAMS.fetch;
  registration = DEFAULT_CMI5_PARAMS.registration;
  urlBase = DEFAULT_URL_BASE;
  locationOriginal?: Location;
  mockAxios: MockAxios;
  mockNewLrs: jest.Mock;
  mockSaveStatements: jest.Mock;
  _isMockSetup = false;

  constructor(params: MockCmi5HelperParams = {}) {
    this.activityId = params.activityId || this.activityId;
    this.actor = params.actor || this.actor;
    this.endpoint = params.endpoint || this.endpoint;
    this.fetch = params.fetch || this.fetch;
    this.registration = params.registration || this.registration;
    this.urlBase = params.urlBase || this.urlBase;
    this.locationOriginal = window.location;
    this.mockAxios = new MockAxios(axios);
    this.mockNewLrs = xapi.newLrs as jest.Mock;
    this.mockSaveStatements = jest.fn();
    this.mockNewLrs.mockImplementation(() => {
      return {
        saveStatements: this.mockSaveStatements,
      };
    });
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

  mockFetch(): void {
    this.mockAxios.onPost(this.fetch).reply(200, {
      "auth-token": Buffer.from(
        `${this.accessTokenUsername}:${this.accessTokenPassword}`
      ).toString("base64"),
    });
  }

  restore(): void {
    if (this.locationOriginal) {
      _setWindowLocation(this.locationOriginal);
    }
    this.mockAxios.restore();
  }
}
