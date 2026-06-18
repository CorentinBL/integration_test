import os
import mysql.connector
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def hello_world():
    return "Hello world"

@app.get("/users")
async def get_users():
    # Create a connection to the database
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST"))
    cursor = conn.cursor()
    sql_select_Query = "select * from utilisateurs"
    cursor.execute(sql_select_Query)
    # get all records
    records = cursor.fetchall()
    # renvoyer nos données et 200 code OK
    return {'utilisateurs': records}