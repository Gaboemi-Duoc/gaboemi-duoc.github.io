
### EJEMPLO DE TESTING ###
# Se instala Selenium en powershell con el comando:
# pip install selenium

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
 
 
# los element1, element2, elementn, etc deberian llamarse test_descripcion
def test1(driver):
    element1 = driver.find_element(By.ID, "correo") # Selecciona elemento por ID de html, este caso id="correo"
    print(element1.text)
    element1.click() # Clickea
    element1.send_keys("asd@asd.asd") # Rellena informacion
 
 
    element2 = driver.find_element(By.ID, "password") # Selecciona id="password"
    print(element2.text)
    element2.click() # Click
    element2.send_keys("asd12345") # Entra info
 
 
    time.sleep(1)  # Pause to see the result
 
 
    # element3 = driver.find_element(By.CLASS_NAME, "btn btn-success w-100")
    element3 = driver.find_element(By.CSS_SELECTOR, "button[type='submit']") # Encuentra button con type='submit'
    print(element3.text)
    element3.click() # Click, enviando ambos ingresos a ser procesados
 
 
    element4 = driver.find_element(By.ID, "correoFeedback") # Encuentra mensaje feedback con id="correoFeedback"
    print(element4.text)
    assert element4.text == "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com." # Checkea si el mensaje es este
    print("Primer caso probado exitosamente. El sistema NO dejó iniciar sesión.") # Si lo logra, print()
 
 
    time.sleep(1)  # Pause to see the result
    
    print("Current URL:") 
    print(driver.current_url)
    link_element = driver.find_element(By.LINK_TEXT, "Bati-Duoc") # Encontrar link con texto "Bati-Duoc"
    print(link_element.text)
    link_element.click() # Click
 
 
    print("Current URL:")
    print(driver.current_url)
    WebDriverWait(driver, 10).until(EC.url_contains("https://vicenteavilac.github.io/index.html")) # Espera que carge la pagina
    assert "https://vicenteavilac.github.io/index.html" in driver.current_url # Revisa que la pagina actual es index.html
    print("Segundo caso probado exitosamente. El sistema pasó a la página de inicio.")
 
 
    time.sleep(3)  # Pause to see the result
 
 
 
if __name__ == "__main__":   # El main que corre todo
    driver = webdriver.Chrome() # Or Firefox(), Edge(), etc.
    driver.get("https://vicenteavilac.github.io/index2.html")
    test1(driver)
    driver.quit()