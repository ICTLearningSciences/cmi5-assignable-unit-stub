import { Cmi5 } from "../src";

const mockWindowLocation = (newLocation: URL | Location) => {
  delete (window as any).location;
  (window as any).location = newLocation;
};

const setLocation = (path: string) =>
  mockWindowLocation(new URL(`https://example.com${path}`));

describe("Cmi5", () => {
  const originalLocation = window.location;

  afterEach(() => {
    // Restore window.location to not destroy other tests
    mockWindowLocation(originalLocation);
  });

  describe("isCmiAvailable", () => {
    it("returns false when any required cmi query params are missing from window.location", async () => {
      expect(Cmi5.isCmiAvailable).toBe(false);
    });
    it("returns true when all required cmi query params are missing from window.location", async () => {
      setLocation(`/?fetch=x&endpoint=x&actor=x&registration=x&activityId=x`)
      // setLocation(`/?fetch=x`)
      console.log(`immediately after set window.location=${window.location}`);
      expect(Cmi5.isCmiAvailable).toBe(true);
    });
  });
});
