using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Users.Response
{
    public class GetUserVoucherResponse
    {
        public long VoucherId { get; set; }

        public double VoucherDiscount { get; set; }

        public long UsrId { get; set; }

        public string VoucherDesc { get; set; } = null!;

        public string VoucherCode { get; set; } = null!;

        public bool StatusVoucher { get; set; }
    }
}