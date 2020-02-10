<!--
    DO NOT CHANGE THIS FILE - IT MAY BE UPDATED DURING THE ASSIGNMENT
-->
## Seddit Backend

You are given a backend server for seddit written in Python.

Do not change any file in the backend directory.

Any changes you make to the backend will be lost.

If you depend on changes you make to the backend your code will break.

you can run the backend in the global space as such.

```bash
cd backend
# on your local system this may just be pip and python not pip3 and python3
pip3 install -r requirements.txt
python3 app.py
```

# User Data

in `backend/db/users.csv` there is a list of all users within the provided database, you can login as any of these users for testing or create your own account. Note that in the case that you put the database in a undesirable state such as accidently making too many accounts or comments on a post etc. simply delete the file `backend/db/test.sqlite3` and restart the backend server. The server will automatically detect the missing file and download a fresh copy.
