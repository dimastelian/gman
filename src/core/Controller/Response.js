;(function() {
    'use strict';

    class Controller_Response {

        constructor(code,key,message,data)
        {
            this.code = code;
            this.key = key;
            this.message = message;
            this.data = data;
        }

        statusCode()
        {
            return this.code;
        }

        code()
        {
            return this.code;
        }

        getJson()
        {
            var out = {};

            if(this.code)
                out.code = this.code;

            if(this.key)
                out.key = this.key;

            if(this.message)
                out.message = this.message;

            if(this.data)
                out.data = this.data;
        }

    }

    module.exports = Controller_Response;

}());
