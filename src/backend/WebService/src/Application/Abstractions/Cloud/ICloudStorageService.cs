using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Abstractions.Cloud
{
    public interface ICloudStorageService
    {
        Task<string> UploadFileAsync(Stream fileStream, string folderName, string id, string fileName, CancellationToken cancellationToken);
        Task DeleteFileAsync(string fileName, CancellationToken cancellationToken);
        string GetFileUrl(string fileName);
    }
}