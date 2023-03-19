import json
import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()


def create_table():
    conn = psycopg2.connect(
        host='localhost',
        database='pokemon-data',
        user='postgres',
        password=os.environ.get('DB_PASSWORD')
    )
    cursor = conn.cursor()
    cursor.execute(
        'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name=%s)',  # noqa
        ('moltres_pokemon',)
    )
    if not cursor.fetchone()[0]:
        cursor.execute("""
            CREATE TABLE moltres_pokemon (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL
            )
        """)
    conn.commit()
    cursor.close()
    conn.close()


def insert_pokemon_data(pokedex):
    conn = psycopg2.connect(
        host='localhost',
        database='pokemon-data',
        user='postgres',
        password=os.environ.get('DB_PASSWORD')
    )
    cursor = conn.cursor()
    for entry in pokedex:
        pokemon = entry['name']['english']
        pokedex_number = entry['id']
        cursor.execute(
            'INSERT INTO moltres_pokemon (name, id) VALUES (%s, %s)',
            (pokemon, pokedex_number),
        )
    conn.commit()
    cursor.close()
    conn.close()


if __name__ == '__main__':
    try:
        create_table()
        with open('utils/pokedex.json', encoding='utf8') as f:
            pokedex = json.load(f)
        insert_pokemon_data(pokedex)
    except psycopg2.errors.UniqueViolation as e:
        print(e)
    else:
        print('OK!')
