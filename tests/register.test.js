const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

describe("Registration Functionality Tests", () => {
  let driver;
  const baseUrl = "https://6mhg9r-3000.csb.app/";

  beforeAll(async () => {
    console.log("Setting up driver for registration tests...");
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
    console.log("Tearing down registration test driver...");
    if (driver) {
      await driver.quit();
    }
    console.log("Driver teardown complete");
  }, 30000);

  beforeEach(async () => {
    console.log("Navigating to registration page...");
    await driver.get(baseUrl + "/register");
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

  test("should register new user successfully", async () => {
    console.log("Starting registration test...");

    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testName = `Test User ${timestamp}`;

    const nameInput = await waitForElement('input[type="text"]');
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    const passwordInput = await driver.findElement(
      By.css('input[type="password"]')
    );
    const submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );

    await nameInput.clear();
    await nameInput.sendKeys(testName);
    await emailInput.clear();
    await emailInput.sendKeys(testEmail);
    await passwordInput.clear();
    await passwordInput.sendKeys("password123");

    console.log("Submitting registration form...");
    await submitButton.click();

    // Wait for redirect to home page after successful registration
    await waitForUrl(baseUrl + "/", 15000);

    console.log("Verifying registration and auto-login...");
    // Verify user is logged in after registration
    const currentUser = await driver.executeScript(
      'return localStorage.getItem("currentUser")'
    );
    expect(currentUser).toBeTruthy();

    const userData = JSON.parse(currentUser);
    expect(userData.correo).toBe(testEmail);
    expect(userData.nombre).toBe(testName);

    console.log("Registration test completed successfully");
  }, 30000);

  test("should show error for existing email", async () => {
    console.log("Testing duplicate email registration...");

    const nameInput = await waitForElement('input[type="text"]');
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    const passwordInput = await driver.findElement(
      By.css('input[type="password"]')
    );
    const submitButton = await driver.findElement(
      By.css('button[type="submit"]')
    );

    await nameInput.clear();
    await nameInput.sendKeys("New User");
    await emailInput.clear();
    await emailInput.sendKeys("test@admin.com"); // Already exists
    await passwordInput.clear();
    await passwordInput.sendKeys("password123");

    await submitButton.click();

    // Wait a bit for error handling
    await driver.sleep(2000);

    // Should still be on registration page or show error
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/register");

    console.log("Duplicate email test completed");
  }, 30000);
});
