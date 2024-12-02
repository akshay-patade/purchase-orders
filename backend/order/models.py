import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _



import uuid
# Create your models here.
class Order(models.Model):

    class ProcessedStatus(models.TextChoices):
        PROCESSED = 'processed', 'Processed'
        FINAL = 'final', 'Final'

    id = models.BigAutoField(verbose_name =_("Id"), primary_key=True, editable=False)
    file = models.FileField(verbose_name=_("File Path"), upload_to = "uploads/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    process_status = models.CharField(
        max_length=20,
        choices=ProcessedStatus.choices,
        default=ProcessedStatus.PROCESSED
    )  

class OrderDetails(models.Model):

    id = models.UUIDField(verbose_name=_("ID"), default= uuid.uuid4, primary_key = True, editable = False)
    order_id = models.ForeignKey(verbose_name = _("Order Number"), to = Order, on_delete = models.CASCADE, related_name = "order_details")
    product_description = models.CharField(verbose_name = _("Product Description"), max_length = 200)
    item_number = models.CharField(verbose_name = _("Item Number"), max_length = 200)
    vendor_number = models.CharField(verbose_name = _("Vendor Name"), max_length=100)
    quantity = models.CharField(verbose_name = _("quantity"), max_length=100)
    unit_price = models.CharField(verbose_name = _("unit price"), max_length = 100)
    total = models.CharField(verbose_name = _("total"), max_length=200)
    updated_at = models.DateTimeField(verbose_name = _("Updated at"), auto_now = True)
