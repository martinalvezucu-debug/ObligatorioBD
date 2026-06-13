import mysql.connector

def connect_db():
    return mysql.connector.connect(
        host="home-dc",
        user="diego",
        password="Pepe1234",
        database="obligatorio"
    )