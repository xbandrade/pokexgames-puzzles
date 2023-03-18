import random

from django.shortcuts import render
from django.template.defaulttags import register
from django.views.generic import View

from lugia.forms import LugiaFluteEntry


@register.filter
def multiply(value, arg):
    return value * arg


class LugiaFlute(View):
    template_name = 'lugia/pages/flute.html'
    form_class = LugiaFluteEntry

    def get(self, request, *args, **kwargs):
        notes = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A#', 'C#', 'D#', 'F#', 'G#'
        ]
        notes_sequence = random.choices(notes, k=50)
        context = {
            'range': range(5),
            'notes': notes_sequence,
            'form': self.form_class
        }
        return render(
            self.request,
            self.template_name,
            context
        )
