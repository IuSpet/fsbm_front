'use strict'
var sendPostRequest = function (options) {
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

var isPasswordAvailable = function (password)  {

}