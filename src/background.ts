export class UMES_Background {

    name: string
    icon: string

    constructor(name: string, icon: string) {

        this.name = name
        // @ts-ignore
        this.icon = browser.runtime.getURL(icon)

        // @ts-ignore
        browser.runtime.onMessage.addListener(this.onMessage.bind(this))
    }

    onMessage(request: any, sender: any, sendResponse: any) { // TODO: Type this.
        console.log("Request: ", request)
        if (request.action === "UMES_makeRequest") {
            this.makeRequest(request.url, sendResponse, request.options);
        } else if (request.action === "UMES_enumExtensions") {
            sendResponse(this.getExtensionInfos());
        }
    }

    getExtensionInfos() {
        return {
            name: this.name,
            icon: this.icon
        }
    }
    
    makeRequest(url: string, sendResponse: (res: any) => void, options: any = {}) {
        try {
            options = options || {}
            var xhr = new XMLHttpRequest();
            xhr.open(options.method || "GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        sendResponse({ success: true, json: JSON.parse(xhr.responseText) });
                    } else {
                        sendResponse({ success: false, error: xhr.statusText });
                    }
                }
            };
            const data = typeof options.body == "object" ? JSON.stringify(options.body) : options.body
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        } catch (e) {
            console.error("[UMES] makeRequest error: ", e)
            sendResponse({ success: false, error: e });
        }
    }
}