from django.db import models


class Pokemon(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = 'pokedex'
