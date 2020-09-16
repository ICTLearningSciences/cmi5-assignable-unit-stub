import { Cmi5 } from "../../src";
import { MockCmi5Helper } from "../helpers";

describe("Cmi5", () => {
  let mockCmi5: MockCmi5Helper;

  beforeEach(() => {
    mockCmi5 = new MockCmi5Helper();
  });

  afterEach(() => {
    mockCmi5.restore();
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
});
