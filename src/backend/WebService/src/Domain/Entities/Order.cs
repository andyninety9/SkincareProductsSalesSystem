﻿using System;
using System.Collections.Generic;

namespace Domain.Entities;

public partial class Order
{
    public long OrdId { get; set; }

    public long UsrId { get; set; }

    public long? EventId { get; set; }

    public DateTime OrdDate { get; set; }

    public short OrdStatusId { get; set; }

    public double TotalOrdPrice { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool? IsPaid { get; set; }

    public string? VoucherCodeApplied { get; set; }

    public virtual ICollection<DeliveryDetail> DeliveryDetails { get; set; } = new List<DeliveryDetail>();

    public virtual Event? Event { get; set; }

    public virtual OrderStatus OrdStatus { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<OrderLog> OrderLogs { get; set; } = new List<OrderLog>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<ReturnProduct> ReturnProducts { get; set; } = new List<ReturnProduct>();

    public virtual User Usr { get; set; } = null!;

    public virtual ICollection<WarantyOrder> WarantyOrders { get; set; } = new List<WarantyOrder>();
}
