// Write your tests here
const db = require("../data/dbConfig")
const request = require('supertest');
const server = require("./server")

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

afterAll(async () => {
  await db.destroy()
})

beforeEach(async () => {
  await db("users").truncate();
  await request(server).post("/api/auth/register").send({
    username: "testuisername",
    password: "testpassword",
  });
});


test("check environment", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});


describe("[REGISTER] / REGISTER ROUTER", () => {
  test("CAN REGISTER A NEW USER", () => {
    async () => {
      let result = await request(server).post("/api/auth/register").send({
        username: "testuisername",
        password: "testpassword"
      });
      expect(result.status).toBe(201); //passed
      expect(result.body).toMatchObject({ username: "testuisername" });
      expect(result.body).toHaveProperty("id" && "password" && "username");
    }
  })
}
)

describe("[LOGIN] / LOGIN USER", () => {
  test("CAN LOGIN AN EXISTING USER", async () => {
    let result = await request(server).post("/api/auth/login").send({ username: "testuisername", password: "testpassword" })

    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({ message: `welcome, testuisername` })
  })

  test("CANNOT LOGIN WITH NON-EXISTANT USER", async () => {
    let result = await request(server).post("/api/auth/login").send({ username: "deezApples3" })
    expect(result.status).toBe(500); //
    expect(result.body).toMatchObject({ message: "username and password required" })
  })
})

describe("[JOKES] / JOKES ROUTER", () => {
  test("GRANT ACCESS IF GIVEN TOKEN", async () => {
    const result = await request(server).post("/api/auth/login").send({
      username: "testuisername",
      password: "testpassword"
    })
    const token = result.body.token
    const final = await request(server).get("/api/jokes").set("authorization", token)
    expect(final.status).toBe(200) //passed.
  })

  test("DENY ACCESS IF NOT GIVEN TOKEN", async () => {
    const final = await request(server).get("/api/jokes")
    expect(final.status).toBe(401) //passed.
  })

})