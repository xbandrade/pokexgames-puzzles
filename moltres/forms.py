from django import forms

from .models import Pokemon


class PokemonNameForm(forms.ModelForm):
    for i in range(10):
        locals()[f'character_{i}'] = forms.CharField(
            widget=forms.TextInput(attrs={
                'class': 'char-form'
            }),
            max_length=1,
            required=False,
        )

    class Meta:
        model = Pokemon
        fields = [f'character_{i}' for i in range(10)]

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data
