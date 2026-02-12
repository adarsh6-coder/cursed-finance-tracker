# QUICK START GUIDE - Finance Tracker

## What You Need
✅ Python 3.8 or higher
✅ That's it! No database installation needed!

## Setup in 5 Steps

### Step 1: Extract Files
Create a folder called `finance-tracker` and extract:
- static.zip → creates `static/` folder
- api.zip → creates `api/` folder
- finance_tracker.zip → creates `finance_tracker/` folder
- Place `manage.py` and `requirements.txt` in the root

### Step 2: Open Terminal
- **Windows:** Shift + Right-click in the folder → "Open PowerShell window here"
- **Mac/Linux:** Right-click → "Open Terminal here"

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Setup Database
```bash
python manage.py migrate
```

### Step 5: Run!
```bash
python manage.py runserver
```

Then open your browser to: **http://127.0.0.1:8000/**

## That's It!

Your data saves automatically in a file called `db.sqlite3` in your project folder.

## Common Commands

**Start the app:**
```bash
python manage.py runserver
```

**Create admin user (optional):**
```bash
python manage.py createsuperuser
```

**Reset everything:**
Delete `db.sqlite3` file and run `python manage.py migrate` again

## Troubleshooting

**"pip not found":**
- Make sure Python is installed and added to PATH
- Try `python -m pip install -r requirements.txt` instead

**"Port already in use":**
- Run on different port: `python manage.py runserver 8080`
- Access at: `http://127.0.0.1:8080/`

**Page not loading:**
- Make sure terminal shows "Starting development server..."
- Don't close the terminal window
- Try `http://localhost:8000/` instead

## Need Help?
Check the full README.md for detailed instructions!
