using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class TreatmentSolution
{
    public short SolutionId { get; set; }

    public short SkinTypeId { get; set; }

    public string SolutionContent { get; set; } = null!;

    public virtual SkinType SkinType { get; set; } = null!;
}
