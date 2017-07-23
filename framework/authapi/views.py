from django.shortcuts import redirect
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import django
if django.VERSION < (1, 9): #todo remove
    from rest_auth.registration.views import Register
else:
    from rest_auth.registration.views import RegisterView

from allauth.account.views import ConfirmEmailView

from mapviewer.models import MapViewer


class SetMapId(APIView):
    def get(self, request, pk):
        request.session['mapIdForRegister'] = pk
        return Response({})


# REST view to register a user with permission check if registration is enabled!
# based on rest_auth.registration.views.Register
if django.VERSION < (1, 9):  # todo remove
    class RegisterUser(Register):
        def post(self, request, pk):
            try:
                map = MapViewer.objects.get(pk=pk)
            except MapViewer.DoesNotExist:
                return Response({'error': 'Mapviewer ID was not found!'}, status=status.HTTP_404_NOT_FOUND)

            if map.auth_registration == False:
                return Response({'error': 'Registration is not allowed!'}, status=status.HTTP_403_FORBIDDEN)
            else:
                # new session will be generated with this registration, so we have to shift the mapId variable afterwards
                returned = super(RegisterUser, self).post(request)
                request.session['mapIdForRegister'] = pk
                return returned
else:
    class RegisterUser(RegisterView):
        def post(self, request, pk):
            try:
                map = MapViewer.objects.get(pk=pk)
            except MapViewer.DoesNotExist:
                return Response({'error': 'Mapviewer ID was not found!'}, status=status.HTTP_404_NOT_FOUND)

            if map.auth_registration == False:
                return Response({'error': 'Registration is not allowed!'}, status=status.HTTP_403_FORBIDDEN)
            else:
                # new session will be generated with this registration, so we have to shift the mapId variable afterwards
                returned = super(RegisterUser, self).post(request)
                request.session['mapIdForRegister'] = pk
                return returned


# REST view to email verification and final redirect to webpage
class VerifyEmail(APIView, ConfirmEmailView):
    permission_classes = (AllowAny,)
    allowed_methods = ('GET', 'OPTIONS', 'HEAD')

    def get(self, request, key, *args, **kwargs):
        self.kwargs['key'] = key
        url_add = '#!/verify_success'
        try:
            confirmation = self.get_object()
            confirmation.confirm(self.request)
        except:
            url_add = '#!/verify_error'

        redirect_url = self.get_redirect_url()
        if 'mapIdForRegister' in request.session:
            # get URL from mapviewer
            from django.core.urlresolvers import reverse
            redirect_url = reverse("mapviewer_detail", args=[int(request.session.get('mapIdForRegister'))])
            del request.session['mapIdForRegister']

        if not redirect_url:
            ctx = self.get_context_data()
            return self.render_to_response(ctx)
        return redirect(redirect_url+url_add)


# REST view for password confirm reset -> redirect to webpage
class ConfirmPasswordReset(APIView):
    permission_classes = (AllowAny,)
    allowed_methods = ('GET', 'OPTIONS', 'HEAD')

    def get(self, request, uidb64, token, *args, **kwargs):
        redirect_url = '/'
        urladd = '#!/password-reset-confirm/'+uidb64+'/'+token+'/'

        if 'mapIdForRegister' in request.session:
            # get URL from mapviewer
            from django.core.urlresolvers import reverse
            redirect_url = reverse("mapviewer_detail", args=[int(request.session['mapIdForRegister'])])
            del request.session['mapIdForRegister']
        return redirect(redirect_url+urladd)


# REST view to delete the currently logged in user
class DeleteUser(APIView):
    permission_classes = (AllowAny,)

    def delete(self, request):
        try:
            request.user.delete()
            return Response({"success": "Successfully deleted"}, status=status.HTTP_200_OK)
        except:
            pass

        return Response({"success": "An error occurred!"}, status=status.HTTP_200_OK)
