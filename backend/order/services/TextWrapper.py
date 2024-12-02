import boto3
import os

class TextWrapper:

    def __init__(self, document_path:str = None):

        self.client = boto3.client('textract', aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID"), aws_secret_access_key = os.environ.get("AWS_SECRET_ACCESS_KEY"), region_name = os.environ.get("AWS_DEFAULT_REGION"))
        self.document_path = document_path
    
    def extract_product_table(self):

        with open(self.document_path, 'rb') as file:
            # Call Textract
            response = self.client.analyze_document(
                Document={'Bytes': file.read()},
                FeatureTypes=['TABLES']
            )
        

        # Map Block Ids
        blocks = {block['Id']: block for block in response['Blocks']}

        def clean_table(table):
            # Remove rows where all elements are empty
            cleaned_table = [row for row in table if any(cell.strip() for cell in row)]
            return cleaned_table

        # Helper function to extract text from a block's relationships
        def get_text_from_relationships(relationships):
            text = []
            for rel in relationships:
                for word_id in rel['Ids']:
                    if blocks[word_id]['BlockType'] == 'WORD':
                        text.append(blocks[word_id]['Text'])
            return ' '.join(text)

        # Extract all tables
        product_table = []
        for block in response['Blocks']:
            if block['BlockType'] == 'TABLE':
                rows = []
                for relationship in block.get('Relationships', []):
                    if relationship['Type'] == 'CHILD':
                        for cell_id in relationship['Ids']:
                            cell = blocks[cell_id]
                            if cell['BlockType'] == 'CELL':
                                row_index = cell['RowIndex']
                                col_index = cell['ColumnIndex']
                                text = get_text_from_relationships(cell.get('Relationships', []))
                                while len(rows) < row_index:
                                    rows.append([])
                                while len(rows[row_index - 1]) < col_index:
                                    rows[row_index - 1].append("")
                                rows[row_index - 1][col_index - 1] = text

                # Check for product-specific headers
                if rows and any(header in rows[0] for header in ["Product Code", "Description", "Quantity", "Amount", "Qty", "Price",  "Unit Price", "Request Item", "Manufacturer Code", "Unit Cost", "Cost", "Item Description"]):
                    product_table = rows
                    break  # Stop after finding the first matching table
        
        clean_data = clean_table(product_table)

        return clean_data
