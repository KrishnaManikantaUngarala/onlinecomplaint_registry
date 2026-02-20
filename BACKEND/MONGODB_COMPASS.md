# Connect MongoDB Compass (so Register works)

1. Open **MongoDB Compass**.
2. Click **"New Connection"** (or you may see a connection string box).
3. In the connection string box, enter exactly:
   ```
   mongodb://localhost:27017
   ```
   Or use: `mongodb://127.0.0.1:27017`
4. Click **"Connect"** (or "Connect" at the bottom).
5. After it connects, you should see your local MongoDB. You do **not** need to create any database.
6. Start the backend: in a terminal run `cd BACKEND` then `npm start`. You should see **"MongoDB connected"** then **"Server running on http://localhost:8000"**.
7. In the app, click Register and fill the form. After you register once, in Compass click **Refresh** (or reopen the connection). You will see a database named **complaintcare** and inside it **user_Schema** with your saved user.

If Compass says "connection refused", start the **MongoDB** service on your computer (Windows: Services → MongoDB Server → Start).
