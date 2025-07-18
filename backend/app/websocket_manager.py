from typing import Dict, List, Set
from fastapi import WebSocket
import json
import asyncio
from datetime import datetime


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, Set[str]] = {}

    async def connect(self, websocket: WebSocket, connection_id: str, user_id: str):
        await websocket.accept()
        self.active_connections[connection_id] = websocket
        
        if user_id not in self.user_connections:
            self.user_connections[user_id] = set()
        self.user_connections[user_id].add(connection_id)

    def disconnect(self, connection_id: str, user_id: str):
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
        
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(connection_id)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        """Send a message to all connections for a specific user"""
        if user_id in self.user_connections:
            message_str = json.dumps(message)
            disconnected = []
            
            for connection_id in self.user_connections[user_id]:
                websocket = self.active_connections.get(connection_id)
                if websocket:
                    try:
                        await websocket.send_text(message_str)
                    except:
                        disconnected.append(connection_id)
            
            # Clean up disconnected connections
            for conn_id in disconnected:
                self.disconnect(conn_id, user_id)

    async def send_project_update(self, user_id: str, update_type: str, data: dict):
        """Send a project creation update to a user"""
        message = {
            "type": "project_update",
            "update_type": update_type,
            "timestamp": datetime.utcnow().isoformat(),
            "data": data
        }
        await self.send_personal_message(message, user_id)


# Create a singleton instance
manager = ConnectionManager()