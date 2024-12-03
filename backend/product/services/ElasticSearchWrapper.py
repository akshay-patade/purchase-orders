import os

from typing import List

from elasticsearch import Elasticsearch

class ElasticSearchWrapper:

    def __init__(self):
        self.client = Elasticsearch(hosts = os.environ.get("ES_CLOUD_URL"), api_key = os.environ.get("ES_CLOUD_API_KEY"))

    def pretty_search_response(self, query, response):
        result = {
            "question": query,
            "matches": []  
        }
        if len(response["hits"]["hits"]) > 0:
            for hit in response["hits"]["hits"]:
                id = hit["_id"]
                score = hit["_score"]
                description = hit["_source"]["description"]
                result["matches"].append({
                    "id": id,
                    "score": score,
                    "description": description
                })
        
        return result
            

    
    def getProductMatchings(self, queries: List[str]):

        result = []

        for query in queries:
            response = self.client.search(
                index=os.environ.get("ES_CLOUD_PRODUCT_INDEX"),
                query={"semantic": {"field": "product_search_semantic", "query": query}},
            )

            temp = self.pretty_search_response(query, response)
            result.append(temp)

        return result
    
    def productBySearchField(self, search_field: str, query: str):
        

            search_body = {
                "_source": [search_field],  # This specifies to return only the description field
                "query": {
                    "match": {
                        search_field: query
                    }
                }
            }

            search_results = self.client.search(
                index="semantic-product-search", 
                body=search_body
            )

            suggestions = []
            for hit in search_results['hits']['hits']:
                suggestions.append(hit['_source']['description'])

            return suggestions

