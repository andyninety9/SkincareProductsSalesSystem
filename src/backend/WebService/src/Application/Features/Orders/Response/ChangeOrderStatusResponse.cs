using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Orders.Response
{
    public class ChangeOrderStatusResponse
    {
        public long OrdId { get; set; }

        public long UsrId { get; set; }

        public long? EventId { get; set; }

        public DateTime OrdDate { get; set; }

        public short OrdStatusId { get; set; }

        public double TotalOrdPrice { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

    }
}