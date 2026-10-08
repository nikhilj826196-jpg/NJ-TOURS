from typing import Dict, List, Set
from fastapi import WebSocket


class ConnectionManager:
    """
    Manages active WebSocket connections for real-time driver GPS broadcasting and customer tracking.
    """

    def __init__(self):
        # Maps category keys to sets of active WebSocket connections
        self.driver_connections: Dict[str, Set[WebSocket]] = {}
        self.customer_connections: Dict[str, Set[WebSocket]] = {}
        self.admin_connections: Set[WebSocket] = set()

    async def connect_driver(self, driver_id: str, websocket: WebSocket):
        await websocket.accept()
        if driver_id not in self.driver_connections:
            self.driver_connections[driver_id] = set()
        self.driver_connections[driver_id].add(websocket)

    def disconnect_driver(self, driver_id: str, websocket: WebSocket):
        if driver_id in self.driver_connections:
            self.driver_connections[driver_id].discard(websocket)
            if not self.driver_connections[driver_id]:
                del self.driver_connections[driver_id]

    async def connect_customer(self, booking_id: str, websocket: WebSocket):
        await websocket.accept()
        if booking_id not in self.customer_connections:
            self.customer_connections[booking_id] = set()
        self.customer_connections[booking_id].add(websocket)

    def disconnect_customer(self, booking_id: str, websocket: WebSocket):
        if booking_id in self.customer_connections:
            self.customer_connections[booking_id].discard(websocket)
            if not self.customer_connections[booking_id]:
                del self.customer_connections[booking_id]

    async def connect_admin(self, websocket: WebSocket):
        await websocket.accept()
        self.admin_connections.add(websocket)

    def disconnect_admin(self, websocket: WebSocket):
        self.admin_connections.discard(websocket)

    async def broadcast_to_booking(self, booking_id: str, message: dict):
        """Sends GPS coordinates to all customers listening to a booking ID."""
        if booking_id in self.customer_connections:
            for ws in list(self.customer_connections[booking_id]):
                try:
                    await ws.send_json(message)
                except Exception:
                    self.disconnect_customer(booking_id, ws)

    async def broadcast_to_admins(self, message: dict):
        """Sends all live GPS coordinates to administrators."""
        for ws in list(self.admin_connections):
            try:
                await ws.send_json(message)
            except Exception:
                self.disconnect_admin(ws)


# Global WebSocket Connection Manager Instance
manager = ConnectionManager()
