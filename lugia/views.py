import random

from django.shortcuts import render
from django.views.generic import View


class LugiaFlute(View):
    template_name = 'lugia/pages/flute.html'

    def get(self, request, *args, **kwargs):
        notes = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A#', 'C#', 'D#', 'F#', 'G#'
        ]
        weights = [1] * 7 + [.2] * 5
        notes_sequence = ['3', '2', '1']
        notes_sequence += random.choices(notes, weights=weights, k=50)
        context = {
            'notes': notes_sequence,
        }
        return render(
            self.request,
            self.template_name,
            context
        )
