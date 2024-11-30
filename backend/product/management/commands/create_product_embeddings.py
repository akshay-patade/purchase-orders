import json

from dotenv import load_dotenv
from elasticsearch import Elasticsearch, helpers

from django.core.management.base import BaseCommand

from product.models import Product
from product.api.serializers import ProductSerializer


class Command(BaseCommand):

    help = 'This Command is used to generate the embeddings for the product and store it in the elastic search database'

    def handle(self, *args, **options):

        load_dotenv()
        client = Elasticsearch(hosts = "https://5856681e52d64c35a4b39da6e44c832b.us-central1.gcp.cloud.es.io:443", api_key = "Rzd0UGU1TUIwRFpHXzJVU2dYaHc6STE0c1NTUUpUbUdLYk1mMUJIb21yQQ==", timeout= 300)
        queryset = Product.objects.filter()

        self.stdout.write(self.style.SUCCESS(client.info()))
        
        #queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        json_data = serializer.data  # This will be a list of dictionaries

        # Prepare bulk actions
        actions = [
            {
                "_index": "semantic-product-search",
                "_id": record["id"],  # Assuming "id" is the primary key
                "_source": record,
            }
            for record in json_data
        ]

        try:
            batch_size = 500
            client.indices.put_settings(
                index="semantic-product-search",
                body={"index": {"refresh_interval": "-1"}}
            )

            for i in range(0, len(actions), batch_size):
                helpers.bulk(client, actions[i:i + batch_size])

            client.indices.put_settings(
                index="semantic-product-search",
                body={"index": {"refresh_interval": "1s"}}
            )

            self.stdout.write(self.style.SUCCESS('Product embeddings created successfully!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error during bulk indexing: {str(e)}"))

        # for record in json_data:
        #     client.index(index="semantic-product-search", body=json.dumps(record))
        
        # self.stdout.write(self.style.SUCCESS('Product embeddings created successfully!'))
