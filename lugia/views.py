import random

from django.shortcuts import render
from django.views.generic import View


class LugiaFlute(View):
    template_name = 'lugia/pages/flute.html'

    def get(self, request, *args, **kwargs):
        curr_path = request.path
        notes = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A#', 'C#', 'D#', 'F#', 'G#'
        ]
        weights = [1] * 7 + [.2] * 5
        notes_sequence = ['3', '2', '1']
        notes_sequence += random.choices(notes, weights=weights, k=50)
        context = {
            'notes': notes_sequence,
            'curr_path': curr_path,
        }
        return render(
            self.request,
            self.template_name,
            context
        )


class Tutorial(View):
    template_name = 'lugia/pages/tutorial.html'

    def get(self, request, *args, **kwargs):
        notes_map = {
            'A': 'A',
            'B': 'B',
            'C': 'C',
            'D': 'D',
            'E': 'E',
            'F': 'F',
            'G': 'G',
            'A#': 'Shift + A',
            'C#': 'Shift + C',
            'D#': 'Shift + D',
            'F#': 'Shift + F',
            'G#': 'Shift + G',
        }
        context = {
            'notes': notes_map,
        }
        return render(
            self.request,
            self.template_name,
            context
        )
