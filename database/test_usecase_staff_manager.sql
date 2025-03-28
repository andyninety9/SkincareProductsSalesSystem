-- 1. View Overview Report
SELECT 
    COUNT(*) AS "totalOrders",
    SUM("totalOrdPrice") AS "totalRevenue",
    AVG("totalOrdPrice") AS "averageOrderValue"
FROM 
    public."Order";

-- 2. View Statistics of Best-Selling Products
SELECT 
    p."productName", 
    SUM(od."quantity") AS "totalSold", 
    SUM(od."quantity" * od."sellPrice") AS "totalRevenue"
FROM 
    public."OrderDetail" od
JOIN 
    public."Product" p ON od."prodID" = p."productID"
GROUP BY 
    p."productName"
ORDER BY 
    "totalSold" DESC;
	
-- 3. View Analyze Customer Behavior
SELECT 
    u."fullname", 
    COUNT(o."ordID") AS "totalOrders", 
    SUM(o."totalOrdPrice") AS "totalSpent"
FROM 
    public."Order" o
JOIN 
    public."User" u ON o."usrID" = u."usrID"
GROUP BY 
    u."fullname"
ORDER BY 
    "totalSpent" DESC;
	
-- 4. View Return Order
SELECT 
    r."returnID", 
    r."returnDate", 
    r."refundAmount", 
    u."fullname" AS "customerName", 
    p."productName", 
    rpd."returnQuantity"
FROM 
    public."ReturnProduct" r
JOIN 
    public."User" u ON r."usrID" = u."usrID"
JOIN 
    public."ReturnProductDetail" rpd ON r."returnID" = rpd."returnID"
JOIN 
    public."Product" p ON rpd."prodIDre" = p."productID";

-- View Product (Dashboard View)
SELECT 
    p."productName", 
    p."stocks", 
    p."sellPrice", 
    p."totalRating", 
    c."cateProdName" AS "category", 
    b."brandName" AS "brand"
FROM 
    public."Product" p
JOIN 
    public."CategoryProduct" c ON p."cateID" = c."cateProdID"
JOIN 
    public."Brand" b ON p."brandID" = b."brandID";