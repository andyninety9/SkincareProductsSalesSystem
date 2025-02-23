namespace Application.Common.Enum
{
    public enum OrderStatusEnum : short
    {
        Pending = 1,
        Processing = 2,
        Shipping = 3,
        Shipped = 4,
        Completed = 5,
        Cancelled = 6,
        Refunded = 7,
        ReturnRequested = 8,
        ReturnProcessing = 9,
        Returned = 10,
        ReturnRejected = 11
    }
}