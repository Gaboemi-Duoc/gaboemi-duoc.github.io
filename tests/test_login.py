import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class TestZmartAuth:
    def setup_method(self, method):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)
        self.base_url = "https://gaboemi-duoc-github-io.vercel.app"  # Adjust to your actual URL
    
    def teardown_method(self, method):
        self.driver.quit()
    
    def generate_test_email(self):
        """Generate unique email for testing"""
        return f"test{int(time.time())}@gmail.com"
    
    def clear_local_storage(self):
        """Clear localStorage to ensure clean state"""
        self.driver.execute_script("window.localStorage.clear();")
    
    def test_successful_registration(self):
        """Test successful user registration"""
        print("\n=== Testing Successful Registration ===")
        
        # Navigate to registration page
        self.driver.get(f"{self.base_url}/register")
        
        # Generate unique test data
        test_email = self.generate_test_email()
        test_name = f"Test User {int(time.time())}"
        test_password = "test123456"
        
        # Fill registration form
        nombre_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Nombre completo']")))
        nombre_input.click()
        nombre_input.send_keys(test_name)
        
        correo_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Correo electrónico']")
        correo_input.click()
        correo_input.send_keys(test_email)
        
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Contraseña']")
        password_input.click()
        password_input.send_keys(test_password)
        
        # Submit registration form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        # Wait for success message
        try:
            success_message = self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//p[contains(text(), 'éxito')]"))
            )
            assert "éxito" in success_message.text
            print("✓ Registration successful message displayed")
            
            # Wait for redirect to home page
            self.wait.until(EC.url_to_be(f"{self.base_url}/"))
            assert self.driver.current_url == f"{self.base_url}/"
            print("✓ Redirected to home page after registration")
            
        except TimeoutException:
            # Check if there's any error message
            error_message = self.driver.find_elements(By.CSS_SELECTOR, "p.text-red-600")
            if error_message:
                print(f"✗ Registration failed: {error_message[0].text}")
                raise
            else:
                print("✗ No success message found")
                raise
    
    def test_duplicate_email_registration(self):
        """Test registration with existing email"""
        print("\n=== Testing Duplicate Email Registration ===")
        
        # Navigate to registration page
        self.driver.get(f"{self.base_url}/register")
        
        # Use existing email from users.json
        existing_email = "test@gmail.com"
        test_name = "Duplicate Test User"
        test_password = "test123456"
        
        # Fill registration form with existing email
        nombre_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Nombre completo']")))
        nombre_input.click()
        nombre_input.send_keys(test_name)
        
        correo_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Correo electrónico']")
        correo_input.click()
        correo_input.send_keys(existing_email)
        
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Contraseña']")
        password_input.click()
        password_input.send_keys(test_password)
        
        # Submit registration form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        # Wait for error message
        try:
            error_message = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "p.text-red-600"))
            )
            assert error_message.is_displayed()
            print("✓ Duplicate email error message displayed")
            print(f"  Error message: {error_message.text}")
            
        except TimeoutException:
            print("✗ No error message for duplicate email")
            raise
    
    def test_successful_login(self):
        """Test successful login with valid credentials"""
        print("\n=== Testing Successful Login ===")
        
        # Clear localStorage first
        self.clear_local_storage()
        
        # Navigate to login page
        self.driver.get(f"{self.base_url}/login")
        
        # Use credentials from users.json
        test_email = "test@gmail.com"
        test_password = "test"
        
        # Fill login form
        correo_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Correo electrónico']")))
        correo_input.click()
        correo_input.send_keys(test_email)
        
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Contraseña']")
        password_input.click()
        password_input.send_keys(test_password)
        
        # Submit login form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        # Wait for redirect to home page and check navbar for user greeting
        try:
            self.wait.until(EC.url_to_be(f"{self.base_url}/"))
            assert self.driver.current_url == f"{self.base_url}/"
            print("✓ Redirected to home page after login")
            
            # Check if user is logged in by looking for the user dropdown
            user_dropdown = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "button#userDropdown"))
            )
            assert "Test" in user_dropdown.text  # From users.json - nombre: "Test"
            print("✓ User is logged in (dropdown visible)")
            
        except TimeoutException:
            # Check for error message
            error_message = self.driver.find_elements(By.CSS_SELECTOR, "p.text-red-600")
            if error_message:
                print(f"✗ Login failed: {error_message[0].text}")
                raise
            else:
                print("✗ Login failed - no redirect to home page")
                raise
    
    def test_invalid_login_credentials(self):
        """Test login with invalid credentials"""
        print("\n=== Testing Invalid Login Credentials ===")
        
        # Navigate to login page
        self.driver.get(f"{self.base_url}/login")
        
        # Fill login form with invalid credentials
        correo_input = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder='Correo electrónico']")))
        correo_input.click()
        correo_input.send_keys("nonexistent@email.com")
        
        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Contraseña']")
        password_input.click()
        password_input.send_keys("wrongpassword")
        
        # Submit login form
        submit_button = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        submit_button.click()
        
        # Wait for error message
        try:
            error_message = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "p.text-red-600"))
            )
            assert error_message.is_displayed()
            print("✓ Invalid credentials error message displayed")
            print(f"  Error message: {error_message.text}")
            
            # Verify we're still on login page
            assert "login" in self.driver.current_url
            print("✓ Stayed on login page after failed login")
            
        except TimeoutException:
            print("✗ No error message for invalid credentials")
            raise
    
    def test_navigation_between_login_register(self):
        """Test navigation between login and register pages"""
        print("\n=== Testing Navigation Between Login and Register ===")
        
        # Start from login page
        self.driver.get(f"{self.base_url}/login")
        
        # Click register link
        register_link = self.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Regístrate aquí"))
        )
        register_link.click()
        
        # Verify navigation to register page
        self.wait.until(EC.url_contains("/register"))
        assert "register" in self.driver.current_url
        print("✓ Navigated from login to register page")
        
        # Click login link
        login_link = self.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Inicia sesión aquí"))
        )
        login_link.click()
        
        # Verify navigation back to login page
        self.wait.until(EC.url_contains("/login"))
        assert "login" in self.driver.current_url
        print("✓ Navigated from register back to login page")
    
    def test_logout_functionality(self):
        """Test user logout functionality"""
        print("\n=== Testing Logout Functionality ===")
        
        # First login
        self.test_successful_login()
        
        # Click user dropdown
        user_dropdown = self.wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button#userDropdown"))
        )
        user_dropdown.click()
        
        # Click logout button
        logout_button = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Cerrar Sesión')]"))
        )
        logout_button.click()
        
        # Verify logout - check for login button in navbar
        try:
            login_button = self.wait.until(
                EC.presence_of_element_located((By.LINK_TEXT, "Iniciar sesión"))
            )
            assert login_button.is_displayed()
            print("✓ Logout successful - login button visible")
            
            # Verify redirect to home page
            assert self.driver.current_url == f"{self.base_url}/"
            print("✓ Stayed on home page after logout")
            
        except TimeoutException:
            print("✗ Logout failed - login button not found")
            raise

def run_all_tests():
    """Run all authentication tests"""
    test_class = TestZmartAuth()
    
    try:
        test_class.setup_method(None)
        
        # Run tests in sequence
        tests = [
            test_class.test_navigation_between_login_register,
            test_class.test_duplicate_email_registration,
            test_class.test_invalid_login_credentials,
            test_class.test_successful_registration,
            test_class.test_successful_login,
            test_class.test_logout_functionality,
        ]
        
        for test in tests:
            try:
                test()
                print(f"✓ {test.__name__} - PASSED\n")
            except Exception as e:
                print(f"✗ {test.__name__} - FAILED: {str(e)}\n")
                # Take screenshot on failure
                test_class.driver.save_screenshot(f"failure_{test.__name__}.png")
        
    finally:
        test_class.teardown_method(None)

if __name__ == "__main__":
    print("Starting Zmart Authentication Tests...")
    run_all_tests()
    print("All tests completed!")