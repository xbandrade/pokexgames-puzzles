import dj_database_url
from dotenv import load_dotenv

load_dotenv()
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {'default': dj_database_url.config(conn_max_age=600, ssl_require=True)}  # noqa
