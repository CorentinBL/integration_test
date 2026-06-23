import pytest
import hashlib
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import app, _active_tokens, hash_password

client = TestClient(app)

FAKE_USER = {
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean@test.fr",
    "date_naissance": "1990-01-01",
    "ville": "Paris",
    "code_postal": "75001",
}

FAKE_USER_ROW = (1, "Dupont", "Jean", "jean@test.fr", "1990-01-01", "Paris", "75001")
FAKE_USER_COLUMNS = ["id", "nom", "prenom", "email", "date_naissance", "ville", "code_postal"]

ADMIN_EMAIL = "admin@test.com"
ADMIN_PASSWORD = "password"
ADMIN_TOKEN = "fake-token-abc123"


def make_cursor_mock(rows=None, columns=None, fetchone_value=None):
    """Crée un curseur mocké avec les données fournies."""
    cursor = MagicMock()
    cursor.fetchall.return_value = rows or []
    cursor.fetchone.return_value = fetchone_value
    cursor.description = [(col,) for col in (columns or [])]
    return cursor


def inject_admin_token():
    """Injecte un token admin valide dans le store global."""
    _active_tokens[ADMIN_TOKEN] = ADMIN_EMAIL
    return ADMIN_TOKEN


def cleanup_token():
    """Nettoie le token admin après le test."""
    _active_tokens.pop(ADMIN_TOKEN, None)


class TestHelloWorld:
    def test_returns_hello_world(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json() == "Hello world"


class TestGetUsers:
    @patch("server.get_db_connection")
    def test_returns_empty_list(self, mock_db):
        cursor = make_cursor_mock(rows=[], columns=FAKE_USER_COLUMNS)
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.get("/users")

        assert response.status_code == 200
        assert response.json() == {"utilisateurs": []}

    @patch("server.get_db_connection")
    def test_returns_user_list(self, mock_db):
        cursor = make_cursor_mock(
            rows=[FAKE_USER_ROW],
            columns=FAKE_USER_COLUMNS,
        )
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.get("/users")

        assert response.status_code == 200
        data = response.json()
        assert len(data["utilisateurs"]) == 1
        assert data["utilisateurs"][0]["email"] == "jean@test.fr"

    @patch("server.get_db_connection")
    def test_returns_500_on_db_error(self, mock_db):
        import mysql.connector
        mock_db.side_effect = mysql.connector.Error("Connection failed")

        response = client.get("/users")

        assert response.status_code == 500
        assert "Database error" in response.json()["detail"]


class TestPostUsers:
    @patch("server.get_db_connection")
    def test_creates_user_successfully(self, mock_db):
        cursor = MagicMock()
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.post("/users", json=FAKE_USER)

        assert response.status_code == 200
        assert response.json()["message"] == "User created successfully"
        cursor.execute.assert_called_once()
        conn.commit.assert_called_once()

    @patch("server.get_db_connection")
    def test_returns_500_on_db_error(self, mock_db):
        import mysql.connector
        mock_db.side_effect = mysql.connector.Error("Insert failed")

        response = client.post("/users", json=FAKE_USER)

        assert response.status_code == 500
        assert "Database error" in response.json()["detail"]

    def test_returns_422_if_missing_field(self):
        incomplete_user = {"nom": "Dupont", "prenom": "Jean"}
        response = client.post("/users", json=incomplete_user)
        assert response.status_code == 422

class TestAdminLogin:
    @patch("server.get_db_connection")
    def test_login_success_returns_token(self, mock_db):
        cursor = make_cursor_mock(fetchone_value=(ADMIN_EMAIL,))
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.post("/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
        })

        assert response.status_code == 200
        assert "token" in response.json()
        assert len(response.json()["token"]) == 64  # secrets.token_hex(32)

    @patch("server.get_db_connection")
    def test_login_invalid_credentials_returns_401(self, mock_db):
        cursor = make_cursor_mock(fetchone_value=None)
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.post("/admin/login", json={
            "email": "bad@test.com",
            "password": "wrongpassword",
        })

        assert response.status_code == 401
        assert response.json()["detail"] == "Identifiants invalides"

    @patch("server.get_db_connection")
    def test_login_stores_token_in_active_tokens(self, mock_db):
        cursor = make_cursor_mock(fetchone_value=(ADMIN_EMAIL,))
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.post("/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
        })

        token = response.json()["token"]
        assert token in _active_tokens
        assert _active_tokens[token] == ADMIN_EMAIL

    @patch("server.get_db_connection")
    def test_login_returns_500_on_db_error(self, mock_db):
        import mysql.connector
        mock_db.side_effect = mysql.connector.Error("DB down")

        response = client.post("/admin/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
        })

        assert response.status_code == 500


class TestDeleteUser:
    def setup_method(self):
        self.token = inject_admin_token()

    def teardown_method(self):
        cleanup_token()

    @patch("server.get_db_connection")
    def test_deletes_user_successfully(self, mock_db):
        cursor = MagicMock()
        cursor.fetchone.return_value = (1,)
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.delete(
            "/users/1",
            headers={"Authorization": f"Bearer {self.token}"},
        )

        assert response.status_code == 200
        assert response.json()["message"] == "User 1 deleted"
        conn.commit.assert_called_once()

    @patch("server.get_db_connection")
    def test_returns_404_if_user_not_found(self, mock_db):
        cursor = MagicMock()
        cursor.fetchone.return_value = None
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.delete(
            "/users/999",
            headers={"Authorization": f"Bearer {self.token}"},
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "Utilisateur introuvable"

    def test_returns_401_without_token(self):
        response = client.delete("/users/1")
        assert response.status_code == 401

    def test_returns_401_with_invalid_token(self):
        response = client.delete(
            "/users/1",
            headers={"Authorization": "Bearer invalid-token"},
        )
        assert response.status_code == 401

    @patch("server.get_db_connection")
    def test_returns_500_on_db_error(self, mock_db):
        import mysql.connector
        mock_db.side_effect = mysql.connector.Error("DB error")

        response = client.delete(
            "/users/1",
            headers={"Authorization": f"Bearer {self.token}"},
        )

        assert response.status_code == 500


class TestGetUserDetail:
    def setup_method(self):
        self.token = inject_admin_token()

    def teardown_method(self):
        cleanup_token()

    @patch("server.get_db_connection")
    def test_returns_user_details(self, mock_db):
        cursor = make_cursor_mock(
            fetchone_value=FAKE_USER_ROW,
            columns=FAKE_USER_COLUMNS,
        )
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.get(
            "/users/1",
            headers={"Authorization": f"Bearer {self.token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "jean@test.fr"
        assert data["ville"] == "Paris"

    @patch("server.get_db_connection")
    def test_returns_404_if_user_not_found(self, mock_db):
        cursor = make_cursor_mock(fetchone_value=None, columns=FAKE_USER_COLUMNS)
        conn = MagicMock()
        conn.cursor.return_value = cursor
        conn.is_connected.return_value = True
        mock_db.return_value = conn

        response = client.get(
            "/users/999",
            headers={"Authorization": f"Bearer {self.token}"},
        )

        assert response.status_code == 404
        assert response.json()["detail"] == "Utilisateur introuvable"

    def test_returns_401_without_token(self):
        response = client.get("/users/1")
        assert response.status_code == 401

    def test_returns_401_with_invalid_token(self):
        response = client.get(
            "/users/1",
            headers={"Authorization": "Bearer invalid-token"},
        )
        assert response.status_code == 401

    @patch("server.get_db_connection")
    def test_returns_500_on_db_error(self, mock_db):
        import mysql.connector
        mock_db.side_effect = mysql.connector.Error("DB error")

        response = client.get(
            "/users/1",
            headers={"Authorization": f"Bearer {self.token}"},
        )

        assert response.status_code == 500


class TestHashPassword:
    def test_returns_sha256_hex(self):
        result = hash_password("password")
        expected = hashlib.sha256("password".encode()).hexdigest()
        assert result == expected

    def test_different_passwords_produce_different_hashes(self):
        assert hash_password("abc") != hash_password("def")

    def test_same_password_always_produces_same_hash(self):
        assert hash_password("password") == hash_password("password")
