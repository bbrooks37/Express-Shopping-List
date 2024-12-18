process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");
// app imports
const app = require("../app");
const DataStore = require("../dataStore");

let item = { name: "silly", price: 200 };

beforeEach(() => {
  DataStore.writeData([item]);
});

afterEach(() => {
  DataStore.writeData([]);
});

// GET /items - returns {items: [item, ...]}
describe("GET /items", () => {
  test("Gets a list of items", async () => {
    const response = await request(app).get(`/items`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ name: "silly", price: 200 }]);
  });
});

// GET /items/:name - return data about one item: {item: item}
describe("GET /items/:name", () => {
  test("Gets a single item", async () => {
    const response = await request(app).get(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(item);
  });

  test("Responds with 404 if can't find item", async () => {
    const response = await request(app).get(`/items/0`);
    expect(response.statusCode).toBe(404);
  });
});

// POST /items - create item from data; return {item: item}
describe("POST /items", () => {
  test("Creates a new item", async () => {
    const response = await request(app).post(`/items`).send({
      name: "Taco",
      price: 0,
    });
    expect(response.statusCode).toBe(201); // Status code should be 201 for creation
    expect(response.body).toEqual({
      added: {
        name: "Taco",
        price: 0,
      },
    });
    expect(DataStore.getAll().length).toBe(2); // Ensure the new item is added
  });
});

// PATCH /items/:name - update item; return {item: item}
describe("PATCH /items/:name", () => {
  test("Updates a single item", async () => {
    const response = await request(app).patch(`/items/${item.name}`).send({
      name: "Troll",
      price: 150, // Include price in update
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      updated: { name: "Troll", price: 150 },
    });
  });

  test("Responds with 404 if can't find item", async () => {
    const response = await request(app).patch(`/items/0`).send({
      name: "Not Found",
      price: 150,
    });
    expect(response.statusCode).toBe(404);
  });
});

// DELETE /items/:name - delete item, return {message: "Deleted"}
describe("DELETE /items/:name", () => {
  test("Deletes a single item", async () => {
    const response = await request(app).delete(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Deleted" });
    expect(DataStore.getAll().length).toBe(0); // Ensure the item is deleted
  });

  test("Responds with 404 if can't find item", async () => {
    const response = await request(app).delete(`/items/0`);
    expect(response.statusCode).toBe(404);
  });
});
