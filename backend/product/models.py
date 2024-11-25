from django.db import models
from django.utils.translation import gettext_lazy as _

import uuid

# Create your models here.

class Product(models.Model):

    id = models.UUIDField(verbose_name = _("Id"), default = uuid.uuid4, primary_key = True, editable = False)
    type = models.CharField(verbose_name = _('Type'), max_length=50)
    material = models.CharField(verbose_name = _('Material'), max_length=50)
    size = models.CharField(verbose_name = _('Size'), max_length=10)
    length = models.CharField(verbose_name = _('Length'), max_length=10)
    coating = models.CharField(verbose_name = _('Coating'), max_length=50)
    thread_type = models.CharField(verbose_name = _('Thread Type'), max_length=50)
    description = models.CharField(verbose_name = _('Description'), max_length=200)