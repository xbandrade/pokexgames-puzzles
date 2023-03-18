from django import forms


class LugiaFluteEntry(forms.Form):
    flute_entry = forms.CharField(
            widget=forms.TextInput(attrs={
                'class': 'flute-char-form'
            }),
            max_length=1,
            required=False,
            label=''
        )

    def clean(self):
        cleaned_data = super().clean()
        return cleaned_data
