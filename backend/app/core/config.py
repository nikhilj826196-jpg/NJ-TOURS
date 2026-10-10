import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE_PATH = BASE_DIR / ".env"


class Settings(BaseSettings):
    PROJECT_NAME: str = "NJ Tours API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "development_secret_key_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = "mysql+aiomysql://root:nikhil1234@localhost:3306/nj_tours"

    # Discrete MySQL Credentials (Alternative to DATABASE_URL, handles special characters)
    MYSQL_HOST: str | None = None
    MYSQL_PORT: int = 3306
    MYSQL_USER: str | None = None
    MYSQL_PASSWORD: str | None = None
    MYSQL_DATABASE: str | None = None
    MYSQL_SSL: bool = False

    # CORS Configuration (comma-separated origins or "*")
    CORS_ORIGINS: str = ""

    # Razorpay Configurations
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""

    # Mail Configurations (Optional for future phases)
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    @property
    def effective_database_url(self) -> str:
        """
        Returns DATABASE_URL, or constructs an async MySQL URL from discrete
        environment variables (safely URL-encoding user credentials).
        """
        if self.MYSQL_HOST and self.MYSQL_USER and self.MYSQL_DATABASE:
            from urllib.parse import quote_plus
            user = quote_plus(self.MYSQL_USER)
            pwd = quote_plus(self.MYSQL_PASSWORD or "")
            return f"mysql+aiomysql://{user}:{pwd}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        return self.DATABASE_URL

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE_PATH),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()


