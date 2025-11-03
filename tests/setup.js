// Test setup for Jasmine tests

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Set up before each test
beforeEach(function () {
  // Mock localStorage
  window.localStorage = new LocalStorageMock();

  // Mock fetch
  window.fetch = jasmine.createSpy("fetch").and.returnValue(
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          message: "Success",
          user: {
            id: Date.now(),
            nombre: "Test User",
            correo: "test@test.com",
          },
        }),
    })
  );

  // Mock window.location
  delete window.location;
  window.location = {
    href: "",
    reload: jasmine.createSpy("reload"),
  };

  // Mock console to avoid cluttering test output
  spyOn(console, "error");
  spyOn(console, "warn");
});

// Test helper functions
window.TestHelpers = {
  generateTestEmail: function () {
    return `test${Date.now()}@gmail.com`;
  },

  createMockUser: function () {
    return {
      id: Date.now(),
      nombre: `Test User ${Date.now()}`,
      correo: this.generateTestEmail(),
    };
  },

  wait: function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
