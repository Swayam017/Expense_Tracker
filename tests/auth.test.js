const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  it("should fail login with invalid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        email: "fake@email.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(401);
  });
});
