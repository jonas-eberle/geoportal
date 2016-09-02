from django.http import HttpResponse
from django.template import RequestContext, loader
from mapviewer import models
from . import settings

# Test view to list all mapviewer objects (also based on user authentication if relevant)
def index(request):
    # Get all MapViewer objects
    viewers = models.MapViewer.objects.all()
    viewers_final = list()
    for viewer in viewers:
        # Check security settings of mapviewer object
        if viewer.auth_perm == True:
            if not request.user.is_authenticated():
                continue
            if request.user not in viewer.auth_users.all() and len(set(list(request.user.groups.all())) & set(list(viewer.auth_groups.all()))) == 0:
                continue
        viewers_final.append(viewer)

    # Load template
    template = loader.get_template('index.html')
    context = RequestContext(request, {
        'viewers': viewers_final,
	'subdir': settings.SUBDIR
    })

    # Render and output template
    return HttpResponse(template.render(context))

def sessions(request):
    html = '<ul>'
    items = request.session.items()
    for key in items:
        html += '<li><strong>'+str(key)+': </strong></li>'
    html += '</ul>'
    return HttpResponse(html)
