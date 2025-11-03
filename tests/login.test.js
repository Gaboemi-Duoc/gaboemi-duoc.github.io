const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

describe("Login Functionality Tests", () => {
  let driver;
  const baseUrl = "https://6mhg9r-3000.csb.app/";

  beforeAll(async () => {
    console.log("Setting up driver...");
    const options = new chrome.Options();
    // options.addArguments('--headless');
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--window-size=1920,1080");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    await driver.manage().setTimeouts({ implicit: 15000, pageLoad: 30000 });
    console.log("Driver setup complete");
  }, 30000);

  afterAll(async () => {
    console.log("Tearing down driver...");
    if (driver) {
      await driver.quit();
    }
    console.log("Driver teardown complete");
  }, 30000);

  beforeEach(async () => {
    console.log("Navigating to login page...");
    await driver.get(baseUrl + "/login");
    await driver.executeScript("window.localStorage.clear();");
    await driver.sleep(1000); // Wait for page to load
  });

  // Helper functions
  const waitForElement = async (selector, timeout = 10000) => {
    return await driver.wait(until.elementLocated(By.css(selector)), timeout);
  };

  const waitForUrl = async (url, timeout = 10000) => {
    return await driver.wait(until.urlIs(url), timeout);
  };

  const waitForUrlContains = async (text, timeout = 10000) => {
    return await driver.wait(until.urlContains(text), timeout);
  };

  test("should login successfully with valid admin credentials", async () => {
    console.log("Starting admin login test...");

    // Fill login form
    const emailInput = await waitForElement('input[type="email"]');
    const passwordInput = await driver.findElement(
      By.css('input[type="password"]')
    );
    const submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );

    await emailInput.clear();
    await emailInput.sendKeys("test@admin.com");
    await passwordInput.clear();
    await passwordInput.sendKeys("admin");

    console.log("Submitting login form...");
    await submitButton.click();

    // Wait for redirect to home page
    await waitForUrl(baseUrl + "/", 15000);

    console.log("Verifying login state...");
    // Verify user is logged in by checking localStorage
    const currentUser = await driver.executeScript(
      'return localStorage.getItem("currentUser")'
    );
    expect(currentUser).toBeTruthy();

    const userData = JSON.parse(currentUser);
    expect(userData.correo).toBe("test@admin.com");
    expect(userData.nombre).toBe("admin");

    // Verify login flag is set
    const isLoggedIn = await driver.executeScript(
      'return localStorage.getItem("isLoggedIn")'
    );
    expect(isLoggedIn).toBe("true");

    console.log("Admin login test completed successfully");
  }, 30000);

  test("should login successfully with valid user credentials", async () => {
    console.log("Starting user login test...");

    const emailInput = await waitForElement('input[type="email"]');
    const passwordInput = await driver.findElement(
      By.css('input[type="password"]')
    );
    const submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );

    await emailInput.clear();
    await emailInput.sendKeys("test@gmail.com");
    await passwordInput.clear();
    await passwordInput.sendKeys("test");

    await submitButton.click();

    await waitForUrl(baseUrl + "/", 15000);

    const currentUser = await driver.executeScript(
      'return localStorage.getItem("currentUser")'
    );
    expect(currentUser).toBeTruthy();

    const userData = JSON.parse(currentUser);
    expect(userData.correo).toBe("test@gmail.com");

    console.log("User login test completed successfully");
  }, 30000);

  test("should show error with invalid credentials", async () => {
    console.log("Starting invalid credentials test...");

    const emailInput = await waitForElement('input[type="email"]');
    const passwordInput = await driver.findElement(
      By.css('input[type="password"]')
    );
    const submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );

    await emailInput.clear();
    await emailInput.sendKeys("invalid@email.com");
    await passwordInput.clear();
    await passwordInput.sendKeys("wrongpassword");

    await submitButton.click();

    // Wait a bit for any error message to appear
    await driver.sleep(2000);

    // We should still be on the login page or show an error
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/login");

    console.log("Invalid credentials test completed");
  }, 30000);
});
