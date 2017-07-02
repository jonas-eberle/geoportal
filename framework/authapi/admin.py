from django.contrib import admin
from django.contrib.sites.models import Site

from allauth.account.models import EmailAddress, EmailConfirmation
from rest_framework.authtoken.models import Token

# Unregister classes that are not relevant for the admin backend, only internal use of registration service!
#admin.site.unregister(EmailConfirmation)
#admin.site.unregister(EmailAddress)
#admin.site.unregister(Site)
admin.site.unregister(Token)
