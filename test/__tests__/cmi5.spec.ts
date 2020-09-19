import {
  Cmi5,
  Cmi5Service,
  VERB_INITIALIZED,
  VERB_PASSED,
  VERB_TERMINATED,
} from "../../src/cmi5";
import { MockCmi5Helper, DEFAULT_CMI5_PARAMS } from "../helpers";
import * as xapi from "../../src/xapi";
jest.mock("../../src/xapi");

async function start(mockCmi5: MockCmi5Helper): Promise<Cmi5Service> {
  mockCmi5.mockLocation();
  mockCmi5.mockFetch();
  const cmi5 = Cmi5.get();
  await cmi5.start();
  return cmi5;
}

function expectActivityStatement(
  cmi5: Cmi5Service,
  verb: string,
  additionalProps: Record<string, any> = {}
) {
  return expect.objectContaining({
    actor: cmi5.params.actor,
    context: expect.objectContaining({
      registration: cmi5.params.registration,
    }),
    object: expect.objectContaining({
      id: cmi5.params.activityId,
    }),
    verb: expect.objectContaining({
      id: verb,
    }),
    ...(additionalProps || {}),
  });
}

describe("Cmi5", () => {
  let mockCmi5: MockCmi5Helper;

  beforeEach(() => {
    mockCmi5 = new MockCmi5Helper();
  });

  afterEach(() => {
    mockCmi5.restore();
    Cmi5.reset();
  });

  describe("get", () => {
    it("makes a new Cmi5 given a url", async () => {
      const cmi5 = Cmi5.get(mockCmi5.url.toString());
      expect(cmi5.params).toEqual(DEFAULT_CMI5_PARAMS);
    });
  });

  describe("isCmiAvailable", () => {
    it("returns false when any required cmi query params are missing from window.location", async () => {
      expect(Cmi5.isCmiAvailable).toBe(false);
    });
    it("returns true when all required cmi query params set in window.location", async () => {
      mockCmi5.mockLocation();
      expect(Cmi5.isCmiAvailable).toBe(true);
    });
  });

  describe("start", () => {
    it("authenticates using the cmi5 fetch param", async () => {
      const cmi5 = await start(mockCmi5);
      expect(cmi5.state.accessToken).toEqual(
        // the access token must have the format of Http basic auth
        Buffer.from(
          `${mockCmi5.accessTokenUsername}:${mockCmi5.accessTokenPassword}`,
          "ascii"
        ).toString("base64")
      );
    });
    it("initializes an lrs client with username and password from access token", async () => {
      // would be more end-to-end
      // if we instead tested the actual headers
      // sent on subsequent xapi POST statements,
      // but much tricker to spy on XHR
      await start(mockCmi5);
      expect(mockCmi5.mockNewLrs).toHaveBeenCalledWith({
        endpoint: mockCmi5.endpoint,
        username: mockCmi5.accessTokenUsername,
        password: mockCmi5.accessTokenPassword,
      });
    });
    it("posts cmi5 INITIALIZED statement", async () => {
      const cmi5 = await start(mockCmi5);
      expect(mockCmi5.mockSaveStatements).toHaveBeenCalledWith([
        expectActivityStatement(cmi5, VERB_INITIALIZED),
      ]);
    });
  });

  describe("passed", () => {
    it("posts cmi5 PASSED statement", async () => {
      const cmi5 = await start(mockCmi5);
      const score = 0.9;
      cmi5.passed({ score: score });
      expect(mockCmi5.mockSaveStatements).toHaveBeenCalledWith([
        expectActivityStatement(cmi5, VERB_PASSED, {
          result: expect.objectContaining({
            score: expect.objectContaining({
              scaled: score,
            }),
          }),
        }),
      ]);
    });
  });

  describe("terminate", () => {
    it("posts cmi5 TERMINATED statement", async () => {
      const cmi5 = await start(mockCmi5);
      cmi5.terminate();
      expect(mockCmi5.mockSaveStatements).toHaveBeenCalledWith([
        expectActivityStatement(cmi5, VERB_TERMINATED),
      ]);
    });
  });
});
