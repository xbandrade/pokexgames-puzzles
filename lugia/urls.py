from django.urls import path

from . import views

app_name = 'lugia'

urlpatterns = [
    path('flute/', views.LugiaFlute.as_view(), name='flute'),
]
