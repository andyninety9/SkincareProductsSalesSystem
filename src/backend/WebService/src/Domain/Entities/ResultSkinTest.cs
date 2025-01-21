using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class ResultSkinTest
{
    public long ResultId { get; set; }

    public long TestId { get; set; }

    public long UsrId { get; set; }

    /// <summary>
    /// OilyDryScore
    /// </summary>
    public short Odscore { get; set; }

    /// <summary>
    /// SensitiveResistantScore
    /// </summary>
    public short Srscore { get; set; }

    /// <summary>
    /// PigmentedNonPigmentedScore
    /// </summary>
    public short Pnpscore { get; set; }

    /// <summary>
    /// WrinkledTightScore
    /// </summary>
    public short Wtscore { get; set; }

    public short SkinTypeId { get; set; }

    public DateTime CreateAt { get; set; }

    public bool IsDefault { get; set; }

    public virtual SkinType SkinType { get; set; } = null!;

    public virtual SkinTypeTest Test { get; set; } = null!;

    public virtual User Usr { get; set; } = null!;
}
