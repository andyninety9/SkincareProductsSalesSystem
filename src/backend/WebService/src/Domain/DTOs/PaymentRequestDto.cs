using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class PaymentRequestDto
    {
        public string OrderId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string ReturnUrl { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string BankCode { get; set; } = string.Empty;
        public string Locale { get; set; } = string.Empty;
        public string OrderType { get; set; } = string.Empty;

        // Billing Info
        public string BillingMobile { get; set; } = string.Empty;
        public string BillingEmail { get; set; } = string.Empty;
        public string BillingFullName { get; set; } = string.Empty;
        public string BillingAddress { get; set; } = string.Empty;
        public string BillingCity { get; set; } = string.Empty;
        public string BillingCountry { get; set; } = string.Empty;

        // Invoice Info
        public string InvoicePhone { get; set; } = string.Empty;
        public string InvoiceEmail { get; set; } = string.Empty;
        public string InvoiceCustomer { get; set; } = string.Empty;
        public string InvoiceAddress { get; set; } = string.Empty;
        public string InvoiceCompany { get; set; } = string.Empty;
        public string InvoiceTaxCode { get; set; } = string.Empty;
        public string InvoiceType { get; set; } = string.Empty;
    }
}