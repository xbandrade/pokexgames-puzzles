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
    cur = conn.cursor()
    cur.execute(
        'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name=%s)',  # noqa
        ('pokedex',)
    )
    if not cur.fetchone()[0]:
        cur.execute("""
            CREATE TABLE pokedex (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL
            )
        """)
    conn.commit()
    cur.close()
    conn.close()


def insert_pokemon_data(pokedex):
    connection = psycopg2.connect(
        host='localhost',
        database='pokemon-data',
        user='postgres',
        password=os.environ.get('DB_PASSWORD')
    )
    curr = connection.cursor()
    for entry in pokedex:
        pokemon = entry['name']['english']
        pokedex_number = entry['id']
        curr.execute(
            'INSERT INTO pokedex (name, id) VALUES (%s, %s)',
            (pokemon, pokedex_number),
        )
    connection.commit()
    curr.close()
    connection.close()


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
