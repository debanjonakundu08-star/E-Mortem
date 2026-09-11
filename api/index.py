import sys
import os

# Add backend directory and workspace root to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Import the FastAPI application
from backend.main import app

# Root and index endpoints for API health check
@app.get("/", include_in_schema=False)
@app.get("/api", include_in_schema=False)
def api_root():
    return {
        "service": "E-Mortem API",
        "status": "ok",
        "version": "1.0.0",
        "documentation": "/docs"
    }

# ASGI Middleware to ensure /api prefix compatibility across Vercel rewrite modes
class VercelPrefixMiddleware:
    def __init__(self, asgi_app):
        self.asgi_app = asgi_app

    async def __call__(self, scope, receive, send):
        if scope.get("type") in ("http", "websocket"):
            path = scope.get("path", "")
            if path and not path.startswith("/api") and path != "/docs" and path != "/openapi.json":
                scope = dict(scope)
                scope["path"] = f"/api{path}"
                if "raw_path" in scope and isinstance(scope["raw_path"], bytes):
                    scope["raw_path"] = b"/api" + scope["raw_path"]
        await self.asgi_app(scope, receive, send)

# Wrap app with the path compatibility middleware
app = VercelPrefixMiddleware(app)
