from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CSW

from mapviewer.models import MapViewer

# REST view to provide CSW-based search
class CSWRequest(APIView):
    def get_object(self, pk):
        try:
            return MapViewer.objects.get(pk=pk)
        except MapViewer.DoesNotExist:
            raise Http404

    # provide HTTP POST method
    def post(self, request, pk, format=None):
        mapviewer = self.get_object(pk)
        params = request.data

        text = params.get('text')
        bbox = None
        if params.has_key('bbox'):
            if isinstance(params.get['bbox'], list):
                bbox = params.get('bbox')
            else:
                bbox = None

        start = 0
        if params.has_key('start'):
            start = int(params.get('start'))

        # search in CSW server
        result = mapviewer.search_url.search(text, bbox, start)
        if isinstance(result, dict):
            return Response(result)
        else:
            return Response([], status=status.HTTP_503_SERVICE_UNAVAILABLE)