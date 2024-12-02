import os
import json

from groq import Groq

class GroqWrapper:

    def __init__(self):
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    def extractOrderDetails(self, clean_product_table):

        # Convert the clean_table to a JSON string
        clean_table_json = json.dumps(clean_product_table)

        # Define the prompt dynamically with the variable
        system_prompt = f"""
        You are an advanced language model tasked with processing a clean table of data and reorganizing it into a structured JSON format based on a defined schema. 

        Here is the input data:
        - The first row in the table represents the column names.
        - Each subsequent row represents data for a product or service.

        Input Table:
        {clean_table_json}

        Your task:
        1. Parse the input table and map its fields to the specified schema below.
        2. If column names are ambiguous or don't directly match the schema fields, use your best judgment to align them based on context and meaning.
        3. If any field does not have a value or cannot be calculated, insert a default value as specified in the schema.

        **Schema Fields and Rules:**
        1. **product_description**: A description of the product or service. If the data is not present, insert "N/A".
        2. **item_number**: A unique code for identifying the product (not the product description). Typically a numeric or short varchar field. If the data is not present, insert "N/A".
        3. **vendor_number**: A code provided by the manufacturer or vendor. Typically a numeric or short varchar field. If the data is not present, insert "N/A".
        4. **quantity**: The number of units of the product. Remove any characters or special symbols, retaining only numeric values. If the data is not present, insert `0`.
        5. **unit_price**: The price per unit of the product. If the data is not present, insert `0`.
        6. **total**: The total price of the product (calculated as quantity multiplied by  unit_price). If the data is not present for quantity or unit_price or total, insert `0`.

        """

        user_prompt = f"""
        Convert the following data into the array of JSON format based on the schema provided above.
          Just give me the array of json data. Do not give me any explanataion
        """

        chat_completion = self.client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        model="llama3-8b-8192",
    )

        return chat_completion.choices[0].message.content


