from django.db import models
from django.utils.translation import gettext_lazy as _

import uuid
# Create your models here.
class Order(models.Model):

    class ProcessedStatus(models.TextChoices):
        PROCESSED = 'processed', 'Processed'
        FINAL = 'final', 'Final'

    id = models.BigAutoField(primary_key=True, editable=False)
    file = models.BinaryField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    process_status = models.CharField(
        max_length=10,
        choices=ProcessedStatus.choices,
        default=ProcessedStatus.PROCESSED
    )  
 