 
 # activate env
  source venv/bin/activate

 # Terminal 1 - Backend
  cd server
  pip install -r requirements.txt
  uvicorn main:app --reload
  # to reset db
  python reset_db.py

  # Terminal 2 - Frontend
  cd client
  npm install
  npm run dev