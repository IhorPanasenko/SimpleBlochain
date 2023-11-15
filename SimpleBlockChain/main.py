import json

from flask import Flask, jsonify, request
from flask_cors import CORS
from Data.blockchain import Blockchain

app = Flask(__name__)
CORS(app)
blockchain = Blockchain()


@app.route('/mine_block', methods=['POST'])
def mine_block():
    data = request.data.decode('utf-8')  # Decode the bytes to a string
    data_dict = json.loads(data)  # Parse the JSON data

    data_value = data_dict.get("data")
    print(
        request.data
    )
    previous_block = blockchain.print_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    block = blockchain.create_block(proof, previous_hash, data_value)

    response = {'message': 'A block is MINED',
                'index': block['index'],
                'timestamp': block['timestamp'],
                'proof': block['proof'],
                'previous_hash': block['previous_hash'],
                'data': block['data']}

    return jsonify(response), 200


@app.route('/get_chain', methods=['GET'])
def display_chain():
    response = {'chain': blockchain.chain,
                'length': len(blockchain.chain)}
    return jsonify(response), 200


@app.route('/valid', methods=['GET'])
def valid():
    is_valid = blockchain.chain_valid(blockchain.chain)

    if is_valid:
        response = {'message': 'The Blockchain is valid.', 'result': True}
    else:
        response = {'message': 'The Blockchain is not valid.', 'result': False}
    return jsonify(response), 200


@app.route('/change_data', methods=['POST'])
def change_data():
    data = request.data.decode('utf-8')
    data_dict = json.loads(data)
    block_index = data_dict.get("block_index")
    new_data = data_dict.get("new_data")

    if block_index is not None and new_data is not None:
        success = blockchain.change_data(block_index, new_data)
        if success:
            response = {'message': 'Data in block {} has been changed.'.format(block_index)}
        else:
            response = {'message': 'Invalid block index or data change failed.'}
    else:
        response = {'message': 'Invalid request parameters.'}

    return jsonify(response), 200


@app.route('/clean_chain', methods=['POST'])
def clean_chain():
    blockchain.validate_and_clean_chain()
    response = {'message': 'Blocks with incorrect hashes have been removed.'}
    return jsonify(response), 200

app.run(host='127.0.0.1', port=5000)
