using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.SkinTypes.Queries.Response
{
    public class GetAllSkinTypesResponse
    {

        /// <summary>
        /// Mã loại da (ví dụ: &quot;OSPT&quot;, &quot;DRNW&quot;).
        /// </summary>
        public string SkinTypeCodes { get; set; } = null!;

        /// <summary>
        /// Tên loại da đầy đủ (ví dụ: &quot;Oily, Sensitive, Pigmented, Tight&quot;).
        /// </summary>
        public string SkinTypeName { get; set; } = null!;

        /// <summary>
        /// Mô tả chi tiết về loại da.
        /// </summary>
        public string SkinTypeDesc { get; set; } = null!;
    }
}