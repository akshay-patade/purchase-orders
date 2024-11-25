import csv
from django.core.management.base import BaseCommand
from product.models import Product

class Command(BaseCommand):
    help = 'Import product data from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Product.objects.update_or_create(
                    type=row['Type'],
                    material=row['Material'],
                    size=row['Size'],
                    length=row['Length'],
                    coating=row['Coating'],
                    thread_type=row['Thread Type'],
                    description=row['Description']
                )
        self.stdout.write(self.style.SUCCESS('Product data imported successfully!'))