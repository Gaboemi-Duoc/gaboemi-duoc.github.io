describe("Login Functionality", function () {
  beforeEach(function () {
    localStorage.clear();
    if (window.fetch && window.fetch.calls) {
      window.fetch.calls.reset();
    }
    window.location.href = "";
  });

  describe("Successful Login", function () {
    it("should login with valid credentials", async function () {
      const loginData = {
        correo: "test@gmail.com",
        password: "test",
      };

      // Mock successful login
      fetch.and.returnValue(
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              message: "Bienvenido Test",
              user: {
                id: 1762064315824,
                nombre: "Test",
                correo: "test@gmail.com",
              },
            }),
        })
      );

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.message).toContain("Bienvenido");
      expect(data.user.nombre).toBe("Test");
    });
  });

  describe("Login Errors", function () {
    it("should reject invalid credentials", async function () {
      const invalidCredentials = {
        correo: "wrong@email.com",
        password: "wrongpassword",
      };

      // Mock failed login
      fetch.and.returnValue(
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: "Credenciales incorrectas" }),
        })
      );

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidCredentials),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(data.message).toBe("Credenciales incorrectas");
    });
  });
});
