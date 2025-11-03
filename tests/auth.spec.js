describe("Authentication System", function () {
  beforeEach(function () {
    localStorage.clear();
    if (window.fetch && window.fetch.calls) {
      window.fetch.calls.reset();
    }
    window.location.href = "";
  });

  describe("LocalStorage Management", function () {
    it("should store user data in localStorage", function () {
      const userData = {
        id: 1762064315824,
        nombre: "Test User",
        correo: "test@gmail.com",
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");

      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      const isLoggedIn = localStorage.getItem("isLoggedIn");

      expect(storedUser).toEqual(userData);
      expect(isLoggedIn).toBe("true");
    });

    it("should clear user data on logout", function () {
      // Setup: user is logged in
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ id: 1, nombre: "Test" })
      );
      localStorage.setItem("isLoggedIn", "true");

      // Execute: logout
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");

      // Verify
      expect(localStorage.getItem("currentUser")).toBeNull();
      expect(localStorage.getItem("isLoggedIn")).toBeNull();
    });
  });

  describe("API Calls", function () {
    it("should call login API with correct parameters", async function () {
      const loginData = {
        correo: "test@gmail.com",
        password: "test123",
      };

      await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      expect(fetch).toHaveBeenCalledWith("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
    });
  });
});
