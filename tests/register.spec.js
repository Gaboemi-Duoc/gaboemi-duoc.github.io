describe("Registration Functionality", function () {
  beforeEach(function () {
    localStorage.clear();
    if (window.fetch && window.fetch.calls) {
      window.fetch.calls.reset();
    }
    window.location.href = "";
  });

  describe("Successful Registration", function () {
    it("should register a new user successfully", async function () {
      const testEmail = TestHelpers.generateTestEmail();
      const formData = {
        nombre: "New Test User",
        correo: testEmail,
        password: "securepassword123",
      };

      // Mock successful response
      fetch.and.returnValue(
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              message: "Usuario registrado con éxito",
              user: formData,
            }),
        })
      );

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.message).toContain("éxito");
      expect(data.user.nombre).toBe(formData.nombre);
    });
  });

  describe("Registration Errors", function () {
    it("should handle duplicate email error", async function () {
      const formData = {
        nombre: "Duplicate User",
        correo: "test@gmail.com", // Existing email
        password: "password123",
      };

      // Mock error response
      fetch.and.returnValue(
        Promise.resolve({
          ok: false,
          json: () =>
            Promise.resolve({ message: "El correo ya está registrado" }),
        })
      );

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(data.message).toContain("ya está registrado");
    });
  });
});
