# NJ Tours Performance & Security Audit Report

This report evaluates current performance characteristics and security hardening configurations applied to the **NJ Tours (National Journey)** API and backend services.

---

## 1. Security Checklist & Hardening Measures

### A. Authentication & Cryptography
- **Passlib Bcrypt**: Passwords are securely hashed before storage using bcrypt.
- **JWT Key Rotation**: Auth tokens are signed via HMAC SHA-256 with key rotation support.
- **Access Control**: Role-Based Access Control (RBAC) restricts customer requests to authorized operations (e.g., cannot delete other users' reviews).

### B. Input Validation & SQL Injection Prevention
- **SQLAlchemy 2.0 ORM**: Parameterized queries are automatically generated, preventing SQL injection vulnerabilities.
- **Pydantic v2 validation**: Enforces exact data models and strips extra fields, protecting against mass-assignment / parameter-pollution.

### C. File Upload Security
- **MIME & Extension Whitelists**: Uploaded media must match whitelisted MIME types and extensions (`.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`).
- **Disk Isolation**: Files are renamed to randomly generated UUIDs, mitigating local file inclusion (LFI) and filename execution exploits.

### D. CORS & Nginx reverse proxy
- **Nginx Configuration**: Acts as a reverse proxy, hiding the underlying FastAPI uvicorn server signature (`Server: uvicorn` headers).
- **Body Limit**: Requests exceeding 25MB are rejected at the Nginx layer, mitigating buffer overflow and resource exhaustion vectors.

---

## 2. Performance & Telemetry Diagnostics

### A. Connection Pooling
- Database connections leverage SQLAlchemy's async connection pool to minimize socket overhead.

### B. Compression & Cache Headers
- Nginx gzip compression reduces network payload sizes for static assets and API JSON payloads.
- Static assets feature `Cache-Control` public headers caching files locally on client devices for up to 30 days.
