from flask import Flask, request, jsonify
from flask_cors import CORS

import openai

app = Flask(__name__)
CORS(app)
openai.api_key = ''


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    terms = data['terms']

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system",
                "content": "I am lawyer who explains easily about it for users"},
            # {"role": "user", "content": f"Can you tell what private information can be opened based on {terms}? Please tell me only keywords"},
            {"role": "user",
                "content": f"This is terms and conditions that I extracted from other company's registeration process: {terms} is there any privacy concern (shorten it as possiple you can)?"}
        ]
    )

    keywords = response.choices[0].message.content

    return jsonify({'message': keywords})


if __name__ == '__main__':
    app.run(port=8000)
