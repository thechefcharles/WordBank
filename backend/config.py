import os

DATABASE_CONFIG = {
    "DRIVER": os.getenv("DB_DRIVER"),
    "SERVER": os.getenv("DB_SERVER"),
    "DATABASE": os.getenv("DB_NAME"),
    "Trusted_Connection": "yes",  # Enable Windows Authentication
}
