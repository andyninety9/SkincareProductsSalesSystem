using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Orders.Commands.Response
{
    public class CancelOrderResponse
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

    }
}