// Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async () => {
  const result = await db.query(`INSERT INTO companies (code, description, name) VALUES ('apple', 'apple', 'Apple') RETURNING code, description, name`);
  testCompany = result.rows[0]
})

afterEach(async () => {
  await db.query(`DELETE FROM companies`);
});


afterAll(async () => {
  await db.end()
})

describe("GET /companies", () => {
  test("Get a list with one company", async () => {
    const res = await request(app).get('/companies')
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ companies: [testCompany] })
  })
})

describe("GET /companies/:code", () => {
  test("Gets a single company", async () => {
    const res = await request(app).get(`/companies/${testCompany.code}`)
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ company: testCompany })
  })
  test("Responds with 404 for invalid id", async () => {
    const res = await request(app).get(`/companies/0`)
    expect(res.statusCode).toBe(404);
  })
})

describe("POST /companies", () => {
  test("Creates a single company", async () => {
    const res = await request(app).post('/companies').send({ code: 'Google', name: 'Google', description: 'Test Google'});
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      company: {
        code: 'Google',
        description: 'Test Google',
        name: 'Google'
      }
    })
  })
})

describe("PATCH /companies/:code", () => {
  test("Updates a single company", async () => {
    const res = await request(app).patch(`/companies/${testCompany.code}`).send({ code: 'Test', name: 'TestPatch', description: 'TestDescription' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      user: { id: testCompany.id, name: 'Test', type: 'TestPatch', description: 'TestDescription' }
    })
  })
  test("Responds with 404 for invalid id", async () => {
    const res = await request(app).patch(`/companies/0`).send({ code: 'Test', name: 'BadPatch' });
    expect(res.statusCode).toBe(404);
  })
})
describe("DELETE /companies/:id", () => {
  test("Deletes a single user", async () => {
    const res = await request(app).delete(`/companies/${testCompany.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: 'DELETED!' })
  })
})


