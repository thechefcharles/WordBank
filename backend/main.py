import pyodbc
from config import DATABASE_CONFIG

# Database connection string
def get_connection_string():
    return (
        f"DRIVER={{{DATABASE_CONFIG['DRIVER']}}};"
        f"SERVER={DATABASE_CONFIG['SERVER']};"
        f"DATABASE={DATABASE_CONFIG['DATABASE']};"
        f"Trusted_Connection={DATABASE_CONFIG['Trusted_Connection']};"
    )

# Create a connection to SQL Server
def get_db_connection():
    conn = pyodbc.connect(get_connection_string())
    return conn
