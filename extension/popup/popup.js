const summaryButton = document.getElementById('summary')

summaryButton.addEventListener('click', () => {
    sendToFlask();
})

function sendToFlask(text) {
    const postData = {
        //   terms: text,
        terms: "At IBM, we value your privacy and are committed to protecting and processing your personal information responsibly. This privacy statement describes how IBM collects, uses and shares your information. It applies to IBM Corporation and IBM subsidiaries except where a subsidiary presents its own statement without reference to IBM’s. Where we provide products, services, or applications as a business-to-business provider to a client, the client is responsible for the collection and use of personal information while using these products, services, or applications. This collection and use is covered by the client’s privacy policy, unless otherwise described. Our agreement with the client may allow us to request and collect information about authorized users of these products, services, or applications for reasons of contract management. In this case, this privacy statement, or a supplementary privacy notice, applies.We may provide additional data privacy information by using a supplementary privacy notice.",
    };
    fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(postData),
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('result').textContent = data.analysis;
            console.log("Analysis:", data.analysis); // Handle the analysis from the server here
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}


document.getElementById('extractButton').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: extractPdfText,
            args: [{ tabId: activeTab.id }]
        });
    });
});

function extractPdfText({ tabId }) {
    const pdfViewer = document.querySelector('embed[type="application/pdf"]');
    if (pdfViewer) {
        const pdfUrl = pdfViewer.src;
        fetch(pdfUrl)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = function () {
                    const data = new Uint8Array(reader.result);
                    const pdfText = pdfjsLib.getPDFTextContent(data);
                    pdfText.then(function (text) {
                        let extractedText = '';
                        text.items.forEach(item => {
                            extractedText += item.str + '\n';
                        });
                        // chrome.scripting.sendMessage({ text: extractedText });
                        console.log(extractedText);
                    });
                };
                reader.readAsArrayBuffer(blob);
            });
    }
}
