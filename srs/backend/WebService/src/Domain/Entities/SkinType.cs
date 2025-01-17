using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class SkinType
{
    public short SkinTypeId { get; set; }

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

    public virtual ICollection<ResultSkinTest> ResultSkinTests { get; set; } = new List<ResultSkinTest>();

    public virtual ICollection<UseFor> UseFors { get; set; } = new List<UseFor>();
}
