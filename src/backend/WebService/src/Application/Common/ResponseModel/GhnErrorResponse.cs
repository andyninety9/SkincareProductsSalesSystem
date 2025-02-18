using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Common.ResponseModel
{
    public class GhnErrorResponse
    {
        [JsonPropertyName("code")]
        public int Code { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = string.Empty;

        [JsonPropertyName("data")]
        public object Data { get; set; } = string.Empty;

        [JsonPropertyName("code_message")]
        public string CodeMessage { get; set; }=string.Empty;

        [JsonPropertyName("code_message_value")]
        public string CodeMessageValue { get; set; }=string.Empty;

        // Hàm lấy danh sách lỗi chi tiết
        public List<string> GetErrorDetails()
        {
            var errorLines = Message.Split("\\n", StringSplitOptions.RemoveEmptyEntries);
            var errorList = new List<string>();

            foreach (var line in errorLines)
            {
                if (line.Contains("Key: 'ShiipCreate."))
                {
                    var cleanedError = line.Replace("Key: 'ShiipCreate.", "").Replace("'", "").Trim();
                    errorList.Add(cleanedError);
                }
            }

            return errorList;
        }
        }
    }