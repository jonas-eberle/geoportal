from django.conf.urls import url, include
from . import views

import django
if django.VERSION < (1, 9): #todo remove
    from rest_auth.registration.views import VerifyEmail
    from django.conf.urls import patterns
    urlpatterns = patterns('',
        url(r'^rest/', include('rest_auth.urls')),
        url(r'^rest/setmapid/(?P<pk>[0-9]+)$', views.SetMapId.as_view(), name='set_map_id'),
        url(r'^rest/registration/(?P<pk>[0-9]+)$', views.RegisterUser.as_view(), name='rest_register'),
        url(r'^rest/registration/verify-email/$', VerifyEmail.as_view(), name='rest_verify_email'),
        url(r"^rest/registration/confirm-email/(?P<key>\w+)/$", views.VerifyEmail.as_view(), name="account_confirm_email"),
        url(r'^rest/password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.ConfirmPasswordReset.as_view(), name='password_reset_confirm'),
        url(r"^rest/user/delete/", views.DeleteUser.as_view(), name="account_delete_user"),
        url(r"^rest/registration/confirmation/send$", views.SetMapId.as_view(), name='account_email_verification_sent'),
    )
else:
    from rest_auth.registration.views import VerifyEmailView
    urlpatterns = [
        url(r'^rest/', include('rest_auth.urls')),
        url(r'^rest/setmapid/(?P<pk>[0-9]+)$', views.SetMapId.as_view(), name='set_map_id'),
        url(r'^rest/registration/(?P<pk>[0-9]+)$', views.RegisterUser.as_view(), name='rest_register'),
        url(r'^rest/registration/verify-email/$', VerifyEmailView.as_view(), name='rest_verify_email'),
        url(r"^rest/registration/confirm-email/(?P<key>[-:\w]+)/$", views.VerifyEmail.as_view(), name="account_confirm_email"),
        url(r'^rest/password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$', views.ConfirmPasswordReset.as_view(), name='password_reset_confirm'),
        url(r"^rest/user/delete/", views.DeleteUser.as_view(), name="account_delete_user"),
        url(r"^rest/registration/confirmation/send$", views.SetMapId.as_view(), name='account_email_verification_sent'),
    ]

