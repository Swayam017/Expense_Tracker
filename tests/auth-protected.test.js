const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

describe("Protected route auth", () => {

  it("should reject request without token", async () => {
    const res = await request(app).get("/expenses");
    expect(res.statusCode).toBe(401);
  });

  it("should reject request with invalid token", async () => {
    const res = await request(app)
      .get("/expenses")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
  });

});
