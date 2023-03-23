from django.urls import path

from . import views

app_name = 'moltres'

urlpatterns = [
    path('', views.MoltresHome.as_view(), name='home'),
    path('about/',
         views.AboutPage.as_view(),
         name='about'),
    path('moltres/search/',
         views.MoltresPokemonSearch.as_view(),
         name='search'),
    path('moltres/results/',
         views.MoltresSearchResults.as_view(),
         name='results'),
]
