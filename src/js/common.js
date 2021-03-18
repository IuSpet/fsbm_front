const sendPostRequest = function (options) {
    $.ajax({
        type: "POST",
        url: options.url,
        async: true,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(options.data),
        success: function (data) {
            if (typeof options.success === 'function') {
                return options.success(data)
            }
        },
        error: function (errorMsg) {
            if (typeof options.error === 'function') {
                return options.error(errorMsg)
            }
        }
    })
};

var isPasswordAvailable = function (password) {

}

const fileDownload = function (data, fileName) {
    if (!data) {
        return;
    }
    let url = window.URL.createObjectURL(new Blob([data]));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
}

// export {sendPostRequest}