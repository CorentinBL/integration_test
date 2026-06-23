import os
import mysql.connector
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    nom: str
    prenom: str
    email: str
    date_naissance: str
    ville: str
    code_postal: str

class AdminLogin(BaseModel):
    email: str
    password: str


_active_tokens: dict[str, str] = {}
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def require_admin_token(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant ou invalide")
    token = authorization.removeprefix("Bearer ").strip()
    if token not in _active_tokens:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
    return _active_tokens[token]

def get_db_connection():
    return mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST")
    )

@app.get("/")
async def hello_world():
    return "Hello world"

@app.get("/users")
async def get_users():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM utilisateurs")
        records = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        users = [dict(zip(columns, row)) for row in records]
        return {'utilisateurs': users}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.post("/users")
async def post_users(user: UserCreate):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        sql_insert_Query = """
            INSERT INTO utilisateurs
            (nom, prenom, email, date_naissance, ville, code_postal)
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        values = (user.nom, user.prenom, user.email, user.date_naissance, user.ville, user.code_postal)
        cursor.execute(sql_insert_Query, values)
        conn.commit()

        return {"message": "User created successfully", "status": "201 Created"}

    except mysql.connector.Error as err:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

@app.post("/admin/login")
async def admin_login(body: AdminLogin):
    conn = cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT email FROM admins WHERE email = %s AND password = %s",
            (body.email, hash_password(body.password)),
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Identifiants invalides")
        token = secrets.token_hex(32)
        _active_tokens[token] = body.email
        return {"token": token}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()

@app.delete("/users/{user_id}", status_code=200)
async def delete_user(user_id: int, admin_email: str = Depends(require_admin_token)):
    conn = cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM utilisateurs WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")
        cursor.execute("DELETE FROM utilisateurs WHERE id = %s", (user_id,))
        conn.commit()
        return {"message": f"User {user_id} deleted"}
    except mysql.connector.Error as err:
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()

@app.get("/users/{user_id}")
async def get_user_detail(user_id: int, admin_email: str = Depends(require_admin_token)):
    conn = cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM utilisateurs WHERE id = %s", (user_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")
        columns = [desc[0] for desc in cursor.description]
        return dict(zip(columns, row))
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        if cursor: cursor.close()
        if conn and conn.is_connected(): conn.close()