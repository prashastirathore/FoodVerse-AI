import os
import json
import asyncio
import re
from typing import Dict, Any, List, Optional
from datetime import datetime
import motor.motor_asyncio
from app.config import settings

class LocalJsonStore:
    """Fallback async-compatible storage when MongoDB is unavailable."""
    def __init__(self, data_file: Optional[str] = None):
        if not data_file:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.data_file = os.path.join(base_dir, "data", "db_store.json")
        else:
            self.data_file = data_file
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        if not os.path.exists(self.data_file):
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump({
                    "users": [],
                    "history": [],
                    "meal_plans": [],
                    "recipes": [],
                    "settings": {}
                }, f, indent=2)

    def _read(self) -> Dict[str, Any]:
        try:
            with open(self.data_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"users": [], "history": [], "meal_plans": [], "recipes": [], "settings": {}}

    def _write(self, data: Dict[str, Any]):
        with open(self.data_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)

    async def find_one(self, collection: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        data = self._read()
        items = data.get(collection, [])
        for item in items:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item
        return None

    async def find(self, collection: str, query: Dict[str, Any] = None, limit: int = 50, sort_by: str = None, reverse: bool = True) -> List[Dict[str, Any]]:
        data = self._read()
        items = data.get(collection, [])
        filtered = []
        for item in items:
            if not query:
                filtered.append(item)
            else:
                match = True
                for k, v in query.items():
                    if item.get(k) != v:
                        match = False
                        break
                if match:
                    filtered.append(item)
        if sort_by and filtered and sort_by in filtered[0]:
            filtered.sort(key=lambda x: str(x.get(sort_by, "")), reverse=reverse)
        return filtered[:limit]

    async def insert_one(self, collection: str, doc: Dict[str, Any]) -> str:
        data = self._read()
        if collection not in data:
            data[collection] = []
        if "_id" not in doc:
            doc["_id"] = f"{collection}_{int(datetime.utcnow().timestamp() * 1000)}"
        if "created_at" not in doc:
            doc["created_at"] = datetime.utcnow().isoformat()
        data[collection].append(doc)
        self._write(data)
        return str(doc["_id"])

    async def update_one(self, collection: str, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        data = self._read()
        items = data.get(collection, [])
        for item in items:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                # Support $set
                set_data = update.get("$set", update)
                item.update(set_data)
                self._write(data)
                return True
        return False

    async def delete_one(self, collection: str, query: Dict[str, Any]) -> bool:
        data = self._read()
        items = data.get(collection, [])
        for idx, item in enumerate(items):
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                items.pop(idx)
                self._write(data)
                return True
        return False

class DatabaseManager:
    def __init__(self):
        self.client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.db = None
        self.use_fallback = False
        self.local_store = LocalJsonStore()
        self.connected = False

    @property
    def is_mongodb_connected(self) -> bool:
        return bool(not self.use_fallback and self.db is not None and self.connected)

    async def connect(self):
        try:
            # Try connecting to MongoDB with a 5-second server selection timeout
            self.client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=5000
            )
            # Check connection
            await self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.use_fallback = False
            self.connected = True
            masked_url = re.sub(r':([^:@]+)@', ':****@', str(settings.MONGODB_URL))
            print(f">>> Connected to MongoDB successfully at {masked_url}")
        except Exception as e:
            masked_err = re.sub(r':([^:@]+)@', ':****@', str(e))
            print(f">>> MongoDB connection not ready ({masked_err}). Enabling Local Resilient JSON Document Store fallback.")
            self.use_fallback = True
            self.connected = False

    async def close(self):
        if self.client and not self.use_fallback:
            self.client.close()
            print(">>> MongoDB connection closed.")

    # High-level data operations that work with either MongoDB or Local fallback
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        if self.use_fallback or self.db is None:
            return await self.local_store.find_one("users", {"email": email.lower()})
        return await self.db.users.find_one({"email": email.lower()})

    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        if self.use_fallback or self.db is None:
            return await self.local_store.find_one("users", {"_id": user_id})
        return await self.db.users.find_one({"_id": user_id})

    async def create_user(self, user_dict: Dict[str, Any]) -> Dict[str, Any]:
        user_dict["email"] = user_dict["email"].lower()
        if "_id" not in user_dict:
            user_dict["_id"] = f"usr_{int(datetime.utcnow().timestamp() * 1000)}"
        user_dict["created_at"] = datetime.utcnow().isoformat()
        if self.use_fallback or self.db is None:
            await self.local_store.insert_one("users", user_dict)
        else:
            await self.db.users.insert_one(user_dict)
        return user_dict

    async def save_history(self, item: Dict[str, Any]) -> Dict[str, Any]:
        if "_id" not in item:
            item["_id"] = f"scan_{int(datetime.utcnow().timestamp() * 1000)}"
        if "created_at" not in item:
            item["created_at"] = datetime.utcnow().isoformat()
        if self.use_fallback or self.db is None:
            await self.local_store.insert_one("history", item)
        else:
            await self.db.history.insert_one(item)
        return item

    async def get_history(self, user_id: str, scan_type: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        query = {"user_id": user_id}
        if scan_type and scan_type != "all":
            query["type"] = scan_type
        if self.use_fallback or self.db is None:
            return await self.local_store.find("history", query, limit=limit, sort_by="created_at", reverse=True)
        cursor = self.db.history.find(query).sort("created_at", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def save_meal_plan(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        if "_id" not in plan:
            plan["_id"] = f"plan_{int(datetime.utcnow().timestamp() * 1000)}"
        if "created_at" not in plan:
            plan["created_at"] = datetime.utcnow().isoformat()
        if self.use_fallback or self.db is None:
            await self.local_store.insert_one("meal_plans", plan)
        else:
            await self.db.meal_plans.insert_one(plan)
        return plan

    async def get_meal_plans(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        query = {"user_id": user_id}
        if self.use_fallback or self.db is None:
            return await self.local_store.find("meal_plans", query, limit=limit, sort_by="created_at", reverse=True)
        cursor = self.db.meal_plans.find(query).sort("created_at", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def save_recipe(self, recipe: Dict[str, Any]) -> Dict[str, Any]:
        if "_id" not in recipe:
            recipe["_id"] = f"rec_{int(datetime.utcnow().timestamp() * 1000)}"
        if "created_at" not in recipe:
            recipe["created_at"] = datetime.utcnow().isoformat()
        if self.use_fallback or self.db is None:
            await self.local_store.insert_one("recipes", recipe)
        else:
            await self.db.recipes.insert_one(recipe)
        return recipe

    async def get_recipes(self, user_id: str) -> List[Dict[str, Any]]:
        query = {"user_id": user_id}
        if self.use_fallback or self.db is None:
            return await self.local_store.find("recipes", query, limit=50, sort_by="created_at", reverse=True)
        cursor = self.db.recipes.find(query).sort("created_at", -1).limit(50)
        return await cursor.to_list(length=50)

    async def delete_recipe(self, recipe_id: str, user_id: str) -> bool:
        query = {"_id": recipe_id, "user_id": user_id}
        if self.use_fallback or self.db is None:
            return await self.local_store.delete_one("recipes", query)
        res = await self.db.recipes.delete_one(query)
        return res.deleted_count > 0

db_manager = DatabaseManager()
