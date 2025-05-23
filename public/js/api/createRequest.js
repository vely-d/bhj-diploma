/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let xhr = new XMLHttpRequest();
    let url = options.url;
    xhr.responseType = options.responseType || 'json';
    xhr.onload = function() {
        options.callback(null, this.response);
    }
    xhr.onerror = function() {
        options.callback(this.response, null);
    }
    switch(options.method) {
        case "GET":
            let dataString = "";
            for(let key in options.data) {
                dataString += `${key}=${options.data[key]}&`;
            }
            url += "?" + dataString.substring(0, dataString.length - 1);
            xhr.open(options.method, url);
            xhr.send();
            break;
        case "POST":
        case "PUT":
        case "DELETE":
            let formData = new FormData();
            for(let key in options.data) {
                formData.append(key, encodeURI(options.data[key]));
            }
            xhr.open(options.method, url);
            xhr.send(formData);
            break;
    }
};
