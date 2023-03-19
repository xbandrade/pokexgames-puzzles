from django import template

register = template.Library()

@register.filter
def sort_keys(value):
    return sorted(value.keys())
