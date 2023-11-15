import datetime
import hashlib
import json


class Blockchain:

    def __init__(self):
        self.chain = []
        self.create_block(proof=1, previous_hash='0', data="")

    def create_block(self, proof, previous_hash, data):
        block = {'index': len(self.chain) + 1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof': proof,
                 'previous_hash': previous_hash,
                 'data': data}
        self.chain.append(block)
        return block

    def print_previous_block(self):
        return self.chain[-1]

    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False

        while check_proof is False:
            hash_operation = hashlib.sha256(
                str(new_proof ** 2 - previous_proof ** 2).encode()).hexdigest()
            if hash_operation[:5] == '00000':
                check_proof = True
            else:
                new_proof += 1

        return new_proof

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1

        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False

            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(
                str(proof ** 2 - previous_proof ** 2).encode()).hexdigest()

            if hash_operation[:5] != '00000':
                return False
            previous_block = block
            block_index += 1

        return True

    def change_data(self, block_index, new_data):
        if 0 <= block_index < len(self.chain):

            block = self.chain[block_index]

            block['data'] = new_data
            block['previous_hash'] = self.hash(self.chain[block_index - 1])
            ##
            block['proof'] = self.proof_of_work(self.chain[block_index - 1]['proof'])

            self.chain[block_index] = block

            return True
        else:
            return False

    def validate_and_clean_chain(self):
        new_chain = [self.chain[0]]
        i = 0

        while i < (len(self.chain)-2):
            next_block = self.chain[i + 1]
            current_block = self.chain[i]

            if next_block['previous_hash'] == self.hash(current_block):
                print("current block\t", current_block, "\nNext block:\t", next_block)
                new_chain.append(next_block)

            i += 1

        self.chain = new_chain
