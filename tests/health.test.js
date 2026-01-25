const request = require("supertest");
const app = require("../app");

describe("Health Check", () => {
  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/random-route");
    expect(res.statusCode).toBe(404);
  });
});
