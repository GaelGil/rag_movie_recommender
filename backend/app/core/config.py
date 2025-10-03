# from dotenv import load_dotenv
from pydantic import field_validator
from pydantic_settings import BaseSettings

# load_dotenv()  # load .env file when using scripts


class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    DATABASE_URL: str
    ALLOWED_ORIGINS: str = ""
    PROJECT_NAME: str = "Movie Recommender"

    # parse ALLOWED_ORIGINS
    @field_validator("ALLOWED_ORIGINS")
    def parse_allowed_origins(cls, v: str) -> list[str]:
        return v.split(",") if v else []

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()  # type: ignore
