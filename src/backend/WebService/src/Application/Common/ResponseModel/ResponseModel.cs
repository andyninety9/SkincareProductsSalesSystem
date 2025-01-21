using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Application.Common.ResponseModel
{
    public class ResponseModel
    {
        public int Id { get; set; } = 1;
        public int StatusCode { get; set; }
        public string Message { get; set; } = null!;
        public object? Data { get; set; }

        private ResponseModel(int statusCode, string message, object? data)
        {
            StatusCode = statusCode;
            Message = message;
            Data = data;
        }

        public static ResponseModel Success(string message, object? data = null)
        {
            return new ResponseModel((int)HttpStatusCode.OK, message, data);
        }

        public static ResponseModel Error(string message, object? data = null)
        {
            return new ResponseModel((int)HttpStatusCode.InternalServerError, message, data);
        }

        public static ResponseModel NotFound(string message, object? data = null)
        {
            return new ResponseModel((int)HttpStatusCode.NotFound, message, data);
        }

        public static ResponseModel BadRequest(string message, object? data = null)
        {
            return new ResponseModel((int)HttpStatusCode.BadRequest, message, data);
        }

        public static ResponseModel Unauthorized(string message, object? data = null)
        {
            return new ResponseModel((int)HttpStatusCode.Unauthorized, message, data);
        }

        public static ResponseModel Forbidden(string message, object? data = null)
        {
            return new ResponseModel((int)HttpStatusCode.Forbidden, message, data);
        }
    }
}