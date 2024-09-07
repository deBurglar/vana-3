import speech_recognition as sr
import re
import mysql.connector

# Initialize recognizer
recognizer = sr.Recognizer()

# Predefined agricultural products
agriculture_product = ['apple', 'banana', 'orange', 'rice', 'wheat', 'corn','potato','tomato','onion']

# MySQL connection setup
def connect_to_db():
    return mysql.connector.connect(
        host="localhost",    # Your MySQL server host
        user="root",  # Your MySQL username
        password="4Kbuyjtcs@",  # Your MySQL password
        database="AgroProduct"  # Your database name
    )

# Create table if not exists
def create_table_if_not_exists(cursor):
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS AgricultureProduct (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product VARCHAR(255),
        quantity VARCHAR(255)
    )
    """)

# Function to insert data into MySQL
def insert_into_db(product, quantity):
    db = connect_to_db()
    cursor = db.cursor()
    create_table_if_not_exists(cursor)
    
    sql = "INSERT INTO AgricultureProduct (product, quantity) VALUES (%s, %s)"
    val = (product, quantity)
    cursor.execute(sql, val)
    
    db.commit()
    print(f"Record inserted: Product = {product}, Quantity = {quantity}")
    
    cursor.close()
    db.close()

# Function to recognize speech
def recognize_speech_from_microphone():
    with sr.Microphone() as source:
        print("Adjusting for ambient noise... Please wait.")
        recognizer.adjust_for_ambient_noise(source, duration=2)
        print("You can start speaking now...")
        audio = recognizer.listen(source)

        try:
            print("Recognizing speech...")
            speech_text = recognizer.recognize_google(audio)
            print("You said: " + speech_text)
            return speech_text.lower()
        except sr.UnknownValueError:
            print("Sorry, I couldn't understand the speech.")
        except sr.RequestError:
            print("Couldn't request results from the service.")
        return None

# Function to extract product and quantity
def extract_product_and_quantity(text):
    quantity = re.search(r'\b\d+\b', text)  # Find the quantity (a number)
    quantity = quantity.group(0) if quantity else "unknown"

    found_product = None
    for product in agriculture_product:
        if product in text:
            found_product = product
            break

    return found_product, quantity

if __name__ == "__main__":
    # Recognize speech
    speech_text = recognize_speech_from_microphone()

    if speech_text:
        # Extract product and quantity from the recognized speech
        product, quantity = extract_product_and_quantity(speech_text)
        if product:
            print(f"Detected Product: {product}, Quantity: {quantity}")
            # Insert into MySQL
            insert_into_db(product, quantity)
        else:
            print("No known agricultural product found.")
