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

    expect([401, 500]).toContain(res.statusCode);

  });
});
