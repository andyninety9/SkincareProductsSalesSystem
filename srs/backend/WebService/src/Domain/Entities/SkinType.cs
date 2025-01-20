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

    public virtual ICollection<RecommendFor> RecommendFors { get; set; } = new List<RecommendFor>();

    public virtual ICollection<ResultQuiz> ResultQuizzes { get; set; } = new List<ResultQuiz>();

    public virtual ICollection<TreatmentSolution> TreatmentSolutions { get; set; } = new List<TreatmentSolution>();
}
