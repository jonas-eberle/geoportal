import cronjobs
from .models import Layer

#python manage.py cron cache_sos_layers
@cronjobs.register()
def cache_sos_layers():
    layers = Layer.objects.filter(ogc_type__exact='SOS')
    for layer in layers:
        print 'Layer: '+str(layer.id)
        layer.cache()