const DEFAULT_ACCESS_TOKEN_USERNAME = "testuser";
const DEFAULT_ACCESS_TOKEN_PASSWORD = "testpassword";
const DEFAULT_CMI5_PARAMS = {
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
  fetch: "http://example.com/fetch",
  registration: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
};
const DEFAULT_URL_BASE = "/";

function url() {
  let url = `/?activityId=${DEFAULT_CMI5_PARAMS.activityId}`;
  url += `&actor=${JSON.stringify(DEFAULT_CMI5_PARAMS.actor)}`;
  url += `&endpoint=${DEFAULT_CMI5_PARAMS.endpoint}`;
  url += `&fetch=${DEFAULT_CMI5_PARAMS.fetch}`;
  url += `&registration=${DEFAULT_CMI5_PARAMS.registration}`;
  return url;
}

describe("Cmi5 example", () => {
  beforeEach(() => {
    cy.server();
  });

  it("launched with missing cmi5 params displays which params are missing", () => {
    cy.visit("/");
    cy.get("#cmi5-params").contains("Missing cmi5 parameter actor");
    cy.get("#cmi5-params").contains("Missing cmi5 parameter activityId");
    cy.get("#cmi5-params").contains("Missing cmi5 parameter endpoint");
    cy.get("#cmi5-params").contains("Missing cmi5 parameter fetch");
    cy.get("#cmi5-params").contains("Missing cmi5 parameter registration");
  });

  it("shows auth status", () => {
    cy.route(DEFAULT_CMI5_PARAMS.fetch, {
      "auth-token": Buffer.from(`testuser:testpassword`).toString("base64"),
    }).as("fetch");

    cy.visit(url());
    cy.wait("@fetch").then((xhr) => {
      console.log(xhr);
      cy.get("#auth").contains("Status: SUCCESS");
    });
  });
});
