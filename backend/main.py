from flask import Flask, request, jsonify
from flask_cors import CORS

import openai

app = Flask(__name__)
CORS(app)
openai.api_key = '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'

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    terms = data['terms']

    print(f'Please analyze the following terms and conditions for any potential privacy concerns. If you identify any privacy-related issues, please highlight them. **Warning: Privacy concern found**{terms}')
    response = openai.Completion.create(
        engine='davinci-002',
        prompt=f'Please analyze the following terms and conditions for any potential privacy concerns. If you identify any privacy-related issues, please highlight them. **Warning: Privacy concern found**{terms}',
        max_tokens=1000,
        n=1,
        stop=['.']
    )
    analysis = response.choices[0].text.strip()

    return jsonify({'analysis': analysis})

if __name__ == '__main__':
    app.run(port=5000)