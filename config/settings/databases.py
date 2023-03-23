import dj_database_url
from dotenv import load_dotenv

load_dotenv()

DATABASES = {'default': dj_database_url.config(conn_max_age=600, ssl_require=True)}  # noqa
