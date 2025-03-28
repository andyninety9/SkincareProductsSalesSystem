SELECT *
FROM public."User"
WHERE "createdAt" BETWEEN '2025-01-01' AND '2025-04-30'
ORDER BY "usrID" ASC;

--  1. Total Users
SELECT COUNT(*) AS total_users
FROM public."User"
WHERE "createdAt" BETWEEN '2025-01-01' AND '2025-04-30'

-- 2. New Users (trong khoảng thời gian)
SELECT COUNT(*) AS new_users
FROM public."User"
WHERE "createdAt" BETWEEN '2025-02-01' AND '2025-04-30';

-- 3. Active Users (đặt đơn trong khoảng thời gian)
SELECT COUNT(DISTINCT "usrID") AS active_users
FROM public."Order"
WHERE "createdAt" BETWEEN '2025-02-01' AND '2025-04-30';

-- 4. User Growth Rate theo khoảng thời gian
WITH current_period AS (
    SELECT COUNT(*) AS count
    FROM public."User"
    WHERE "createdAt" BETWEEN '2025-03-01' AND '2025-04-30'
),
previous_period AS (
    SELECT COUNT(*) AS count
    FROM public."User"
    WHERE "createdAt" BETWEEN '2025-02-01' AND '2025-03-30'
)
SELECT 
    current_period.count AS current_users,
    previous_period.count AS previous_users,
    CASE 
        WHEN previous_period.count = 0 THEN NULL
        ELSE ROUND(
            (current_period.count - previous_period.count) * 100.0 / previous_period.count,
            2
        )
    END AS user_growth_rate_percent
FROM current_period, previous_period;


-- 5. Users by Age Group (⚠️ không cần theo thời gian)
SELECT
  CASE
    WHEN age BETWEEN 18 AND 24 THEN '18-24'
    WHEN age BETWEEN 25 AND 34 THEN '25-34'
    WHEN age BETWEEN 35 AND 44 THEN '35-44'
    WHEN age BETWEEN 45 AND 54 THEN '45-54'
    WHEN age >= 55 THEN '55+'
    ELSE 'Unknown'
  END AS age_group,
  COUNT(*) AS user_count
FROM (
  SELECT DATE_PART('year', AGE("dob")) AS age
  FROM public."User"
  WHERE "dob" IS NOT NULL
) AS derived
GROUP BY age_group
ORDER BY age_group;


--  6. Users by Location (trong khoảng thời gian đăng ký)
SELECT
  a."city" AS location,
  COUNT(DISTINCT a."usrID") AS user_count
FROM public."Address" a
JOIN public."User" u ON u."usrID" = a."usrID"
WHERE a."isDefault" = true
  AND u."createdAt" BETWEEN '2025-01-01' AND '2025-04-30'
GROUP BY a."city"
ORDER BY user_count DESC;

-- Top Spending User
SELECT 
    u."usrID" AS id,
    u."fullname" AS name,
    COUNT(o."ordID") AS orderCount,
    SUM(o."totalOrdPrice") AS totalSpent,
    ROUND(SUM(o."totalOrdPrice")::numeric / NULLIF(COUNT(o."ordID"), 0), 2) AS avgOrderValue
FROM public."User" u
JOIN public."Order" o ON u."usrID" = o."usrID"
WHERE o."ordStatusID" IS NOT NULL -- tránh đơn chưa hoàn tất nếu có
  AND o."isPaid" = true -- chỉ tính đơn đã thanh toán
GROUP BY u."usrID", u."fullname"
ORDER BY totalSpent DESC
LIMIT 10;

-- User Retention Rate
WITH registered_users AS (
  SELECT "usrID", "createdAt"
  FROM public."User"
  WHERE DATE_TRUNC('month', "createdAt") = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
),
orders_after_1m AS (
  SELECT DISTINCT o."usrID"
  FROM public."Order" o
  JOIN registered_users r ON r."usrID" = o."usrID"
  WHERE o."createdAt" >= r."createdAt" + INTERVAL '1 month'
),
orders_after_3m AS (
  SELECT DISTINCT o."usrID"
  FROM public."Order" o
  JOIN registered_users r ON r."usrID" = o."usrID"
  WHERE o."createdAt" >= r."createdAt" + INTERVAL '3 month'
),
orders_after_6m AS (
  SELECT DISTINCT o."usrID"
  FROM public."Order" o
  JOIN registered_users r ON r."usrID" = o."usrID"
  WHERE o."createdAt" >= r."createdAt" + INTERVAL '6 month'
),
orders_after_12m AS (
  SELECT DISTINCT o."usrID"
  FROM public."Order" o
  JOIN registered_users r ON r."usrID" = o."usrID"
  WHERE o."createdAt" >= r."createdAt" + INTERVAL '12 month'
)
SELECT 
  ROUND((COUNT(oa1."usrID")::numeric / NULLIF(COUNT(r."usrID"), 0)) * 100, 2) AS retention_1_month,
  ROUND((COUNT(oa3."usrID")::numeric / NULLIF(COUNT(r."usrID"), 0)) * 100, 2) AS retention_3_month,
  ROUND((COUNT(oa6."usrID")::numeric / NULLIF(COUNT(r."usrID"), 0)) * 100, 2) AS retention_6_month,
  ROUND((COUNT(oa12."usrID")::numeric / NULLIF(COUNT(r."usrID"), 0)) * 100, 2) AS retention_12_month
FROM registered_users r
LEFT JOIN orders_after_1m oa1 ON r."usrID" = oa1."usrID"
LEFT JOIN orders_after_3m oa3 ON r."usrID" = oa3."usrID"
LEFT JOIN orders_after_6m oa6 ON r."usrID" = oa6."usrID"
LEFT JOIN orders_after_12m oa12 ON r."usrID" = oa12."usrID";





