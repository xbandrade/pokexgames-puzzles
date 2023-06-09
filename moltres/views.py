from collections import defaultdict

from django.shortcuts import redirect, render
from django.views.generic import FormView, ListView, View

from moltres.models import Pokemon

from .forms import PokemonNameForm


class MoltresHome(View):
    template_name = 'global/pages/home.html'

    def get(self, request):
        curr_path = request.path
        print('path', curr_path)
        context = {
            'curr_path': curr_path,
        }
        return render(
            self.request,
            self.template_name,
            context
        )


class AboutPage(View):
    template_name = 'global/pages/about.html'

    def get(self, request):
        context = {}
        return render(
            self.request,
            self.template_name,
            context
        )


class MoltresPokemonSearch(FormView):
    template_name = 'moltres/pages/search.html'
    form_class = PokemonNameForm

    def get(self, request, *args, **kwargs):
        context = {
            'range': range(5),
            'form': self.form_class,
        }
        return render(
            self.request,
            self.template_name,
            context
        )

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            cleaned_data = form.cleaned_data
            regex = '^'
            counter = 0
            for i in range(10):
                character = cleaned_data.get(f'character_{i}')
                if character:
                    regex += f'.{{{counter}}}'
                    regex += f'{character}'
                    counter = 0
                else:
                    counter += 1
            regex += '.*'
            matches = Pokemon.objects.filter(name__iregex=regex)
            request.session['matches'] = [match.id for match in matches]
            return redirect('moltres:results')
        else:
            return self.form_invalid(form)


class MoltresSearchResults(ListView):
    template_name = 'moltres/pages/results.html'
    model = Pokemon

    def get_queryset(self):
        matches = self.request.session.get('matches', [])
        pokemon_list = self.model.objects.filter(id__in=matches)
        results = defaultdict(lambda: [])
        for pokemon in pokemon_list:
            results[len(pokemon.name)].append(pokemon)
        return results

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = PokemonNameForm()
        return context
