-- Insert AccountStatus
INSERT INTO public."AccountStatus"(
	"accStatusID", "statusName")
	VALUES (1, 'Unverified');
INSERT INTO public."AccountStatus"(
	"accStatusID", "statusName")
	VALUES (2, 'Verified');
INSERT INTO public."AccountStatus"(
	"accStatusID", "statusName")
	VALUES (3, 'Banned');

-- Insert Role
INSERT INTO public."Role"(
	"roleID", "roleName", "roleStatus")
	VALUES (1, 'Manager', true);
INSERT INTO public."Role"(
	"roleID", "roleName", "roleStatus")
	VALUES (2, 'Staff', true);
INSERT INTO public."Role"(
	"roleID", "roleName", "roleStatus")
	VALUES (3, 'Customer', true);

-- Insert Brand
INSERT INTO public."Brand"(
    "brandID", "brandName", "brandDesc", "brandOrigin", "brandStatus")
VALUES
    (DEFAULT, 'CeraVe', 'Developed with dermatologists, CeraVe offers skincare products with essential ceramides.', 'USA', TRUE),
    (DEFAULT, 'The Ordinary', 'A brand from DECIEM, known for high-quality, affordable skincare with active ingredients.', 'Canada', TRUE),
    (DEFAULT, 'La Roche-Posay', 'French skincare brand focusing on sensitive skin and dermatological treatments.', 'France', TRUE),
    (DEFAULT, 'COSRX', 'A Korean skincare brand specializing in gentle yet effective skincare solutions.', 'South Korea', TRUE),
    (DEFAULT, 'Bioderma', 'A pioneering dermatological brand known for Sensibio micellar water.', 'France', TRUE);

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'Eucerin', 'German brand known for dermatological skincare solutions.', 'Germany', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'Eucerin');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'L''Oreal Paris', 'Global leader in beauty and skincare.', 'France', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'L''Oreal Paris');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'Olay', 'Pioneering brand in anti-aging skincare.', 'USA', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'Olay');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'Thayers', 'Natural skincare brand known for witch hazel-based products.', 'USA', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'Thayers');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'Kiehl’s', 'Luxury skincare brand specializing in natural extracts.', 'USA', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'Kiehl’s');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'Paula’s Choice', 'Science-backed skincare solutions.', 'USA', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'Paula’s Choice');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'Cetaphil', 'Gentle skincare for sensitive skin.', 'USA', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'Cetaphil');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'Neutrogena', 'Dermatologist-recommended skincare brand.', 'USA', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'Neutrogena');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'First Aid Beauty', 'Skincare brand focusing on skin barrier repair.', 'USA', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'First Aid Beauty');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'Aveeno', 'Oat-based skincare brand for hydration.', 'USA', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'Aveeno');

INSERT INTO public."Brand" ("brandName", "brandDesc", "brandOrigin", "brandStatus")
SELECT 'The Body Shop', 'Cruelty-free beauty and skincare products.', 'UK', TRUE
WHERE NOT EXISTS (SELECT 1 FROM public."Brand" WHERE "brandName" = 'The Body Shop');


-- Insert Category Product
INSERT INTO public."CategoryProduct"(
    "cateProdID", "cateProdName", "cateProdStatus")
VALUES
    (DEFAULT, 'Cleansers', TRUE),
    (DEFAULT, 'Moisturizers', TRUE),
    (DEFAULT, 'Serums & Treatments', TRUE),
    (DEFAULT, 'Sunscreens', TRUE),
    (DEFAULT, 'Exfoliants', TRUE),
	(DEFAULT, 'Toners', TRUE);

-- Insert Product Status
INSERT INTO public."ProductStatus"(
    "prodStatusID", "prodStatusName")
VALUES
    (1, 'Available'),
    (2, 'Out of Stock'),
    (3, 'Discontinued'),
    (4, 'Awaiting Restock'),
    (5, 'On Sale');



-- Insert Products
INSERT INTO public."Product"(
    "productID", "cateID", "brandID", "productName", "productDesc", "stocks",
    "costPrice", "sellPrice", "totalRating", "ingredient", "instruction",
    "prodStatusID", "createdAt", "updatedAt")
VALUES
    (DEFAULT, 1, 1, 'CeraVe Hydrating Facial Cleanser', 
    'Sữa rửa mặt dịu nhẹ cho da thường đến da khô.', 100, 200000, 250000, 4.7, 
    'Nước, Glycerin, Ceramides, Hyaluronic Acid', 
    'Làm ướt mặt, massage nhẹ nhàng rồi rửa sạch.', 1, NOW(), NOW()),

    (DEFAULT, 2, 2, 'The Ordinary Niacinamide 10% + Zinc 1%', 
    'Tinh chất giúp giảm mụn và cải thiện kết cấu da.', 150, 150000, 200000, 4.6, 
    'Niacinamide, Zinc PCA, Glycerin', 
    'Dùng vài giọt lên mặt vào sáng và tối.', 1, NOW(), NOW()),

    (DEFAULT, 3, 3, 'La Roche-Posay Cicaplast Baume B5', 
    'Kem dưỡng phục hồi da tổn thương, dịu da.', 90, 300000, 350000, 4.7, 
    'Panthenol, Madecassoside, Shea Butter', 
    'Thoa lên vùng da tổn thương khi cần.', 1, NOW(), NOW()),

    (DEFAULT, 4, 4, 'COSRX Advanced Snail 96 Mucin Power Essence', 
    'Tinh chất dưỡng da với dịch nhầy ốc sên giúp phục hồi và cấp ẩm.', 110, 350000, 420000, 4.6, 
    'Dịch nhầy ốc sên, Sodium Hyaluronate, Allantoin', 
    'Dùng sau bước toner, trước kem dưỡng.', 1, NOW(), NOW()),

    (DEFAULT, 5, 5, 'Bioderma Sensibio H2O Micellar Water', 
    'Nước tẩy trang dịu nhẹ dành cho da nhạy cảm.', 120, 250000, 300000, 4.7, 
    'Nước, PEG-6 Caprylic, Chiết xuất dưa leo', 
    'Dùng bông tẩy trang thấm sản phẩm và lau nhẹ trên mặt.', 1, NOW(), NOW());


INSERT INTO public."Product"(
    "cateID", "brandID", "productName", "productDesc", "stocks",
    "costPrice", "sellPrice", "totalRating", "ingredient", "instruction",
    "prodStatusID", "createdAt", "updatedAt")
VALUES
-- ✅ Sản phẩm dành riêng cho DRNW
(5, (SELECT "brandID" FROM public."Brand" WHERE "brandName" = 'Eucerin'), 
 'Eucerin Hyaluron-Filler Night Cream', 'Kem dưỡng đêm chống lão hóa cho da khô.', 
 100, 500000, 600000, 4.8, 'Hyaluronic Acid, Glycerin, Panthenol', 'Thoa lên mặt vào buổi tối trước khi ngủ.', 1, NOW(), NOW()),

(5, (SELECT "brandID" FROM public."Brand" WHERE "brandName" = 'L''Oreal Paris'), 
 'L''Oreal Paris Revitalift Laser X3', 'Kem dưỡng da tái tạo và săn chắc da.', 
 120, 450000, 550000, 4.7, 'Pro-Xylane, Adenosine, Vitamin C', 'Thoa đều lên mặt và cổ mỗi ngày.', 1, NOW(), NOW()),

(5, (SELECT "brandID" FROM public."Brand" WHERE "brandName" = 'Olay'), 
 'Olay Regenerist Micro-Sculpting Cream', 'Kem dưỡng da chống lão hóa giúp da săn chắc.', 
 110, 480000, 580000, 4.8, 'Amino-Peptide Complex, Hyaluronic Acid, Vitamin B3', 'Thoa lên mặt sáng và tối.', 1, NOW(), NOW());


-- Insert RecommendFor
INSERT INTO public."RecommendFor"("recForID", "prodID", "skinTypeID") VALUES
(DEFAULT, 6, 9),  -- CeraVe Hydrating Facial Cleanser phù hợp cho DSPW
(DEFAULT, 6, 10), -- DSPT
(DEFAULT, 7, 1),  -- The Ordinary phù hợp cho OSPW
(DEFAULT, 7, 2),  -- OSPT
(DEFAULT, 8, 3),  -- La Roche-Posay phù hợp cho OSNW
(DEFAULT, 8, 4),  -- OSNT
(DEFAULT, 9, 13), -- COSRX phù hợp cho DRPW
(DEFAULT, 10, 5); -- Bioderma phù hợp cho ORPW

INSERT INTO public."RecommendFor" ("prodID", "skinTypeID")
SELECT "productID", 15 FROM public."Product"
WHERE "productName" IN (
    'Eucerin Hyaluron-Filler Night Cream',
    'L''Oreal Paris Revitalift Laser X3',
    'Olay Regenerist Micro-Sculpting Cream'
);


-- Insert Order Status
INSERT INTO public."OrderStatus" ("ordStatusID", "ordStatusName") 
VALUES 
    (1, 'Pending'),       -- Đang chờ xác nhận
    (2, 'Processing'),    -- Đang xử lý
    (3, 'Shipping'),      -- Đang vận chuyển đến khách hàng
    (4, 'Shipped'),       -- Đã giao cho đơn vị vận chuyển
    (5, 'Completed'),     -- Đơn hàng đã hoàn tất
    (6, 'Cancelled'),     -- Đơn hàng đã bị hủy
    (7, 'Refunded'),      -- Đã hoàn tiền
    (8, 'Return Requested'), -- Khách hàng yêu cầu trả hàng
    (9, 'Return Processing'), -- Đang xử lý hoàn trả (kiểm tra hàng, phê duyệt)
    (10, 'Returned'),     -- Hàng đã hoàn về kho
    (11, 'Return Rejected'); -- Yêu cầu hoàn trả bị từ chối

-- Insert Order:
INSERT INTO public."Order"(
	"ordID", "usrID", "eventID", "ordDate", "ordStatusID", "totalOrdPrice", "createdAt", "updatedAt")
	VALUES (1, 675755756934397952, null,NOW(), 1, 400000, NOW(), NOW());

-- Insert Order Detail
INSERT INTO public."OrderDetail"(
	"ordDetailID", "ordID", "prodID", quantity, "sellPrice")
	VALUES (1, 1, 7, 1, 150000);
INSERT INTO public."OrderDetail"(
	"ordDetailID", "ordID", "prodID", quantity, "sellPrice")
	VALUES (2, 1, 6, 1, 250000);

-- Insert Payment
INSERT INTO public."Payment"(
	"paymentID", "orderID", "paymentMethod", "paymentAmount", "createdAt")
	VALUES (1, 1, 'VNPay', 400000, NOW());

-- Insert Warranty
INSERT INTO public."WarantyOrder"(
	"warantyID", "ordID", "createdAt", "endDate")
VALUES (1, 1, NOW(), NOW() + INTERVAL '7 days');

-- Insert Address
INSERT INTO public."Address"(
	"addressID", "usrID", "addDetail", ward, district, city, country, "isDefault")
	VALUES (1, 675755756934397952, '43 Xô Viết Nghệ Tĩnh', 'Phường 17', 'Quận Bình Thạnh', 'Thành Phố Hồ Chí Minh', 'Việt Nam', true);
-- Insert Delivery Services
INSERT INTO public."DeliveryService"(
	"DeliServiceID", "contactService", "DeliServiceName", "deliServiceStatus")
	VALUES (1, '19006092', 'Giao Hàng Tiết Kiệm', true);
-- Insert Delivery Detail
INSERT INTO public."DeliveryDetail"(
	"deliID", "deliServiceID", "addressID", "deliPhone", "ordID", "deliStatus", "createAt")
	VALUES (1, 1, 1, '0918788433', 1,true, NOW());

INSERT INTO public."OrderLog"(
	"ordLogID", "newStatusOrdID", "ordID", "usrID", note, "createdAt")
	VALUES (1, 2, 3, 675582975739428864, 'Xác nhận đơn hàng', NOW());
-- Insert Category Question
INSERT INTO public."CategoryQuestion"(
	"cateQuestionID", "cateName", "cateDesc", "createdAt")
VALUES 
    (1, 'Oily vs Dry', 'Đánh giá mức độ dầu và độ ẩm của da', NOW()),
    (2, 'Sensitive vs Resistant', 'Đánh giá độ nhạy cảm của da', NOW()),
    (3, 'Pigmented vs Non-Pigmented', 'Đánh giá sắc tố da', NOW()),
    (4, 'Wrinkled vs Tight', 'Đánh giá độ căng và mức độ lão hóa của da', NOW());
-- Insert Question
INSERT INTO public."Question"(
	"questionID", "cateQuestionID", "questionContent", "createdAt")
VALUES 
    -- Oily vs Dry (cateQuestionID = 1)
    (1, 1, 'Sau khi rửa mặt mà không thoa dưỡng ẩm, kem chống nắng,..., sau 2-3 giờ, trán và má của bạn trông hoặc cảm thấy thế nào?', NOW()),
    (2, 1, 'Trong ảnh, mặt bạn trông bóng dầu như thế nào?', NOW()),
    (3, 1, 'Sau khi thoa kem nền mà không dùng phấn phủ, lớp trang điểm của bạn sau 2-3 giờ ra sao?', NOW()),
    (4, 1, 'Khi ở nơi độ ẩm thấp, nếu bạn không dùng kem dưỡng ẩm, da mặt bạn như thế nào?', NOW()),
    (5, 1, 'Nhìn vào gương phóng đại, bạn có bao nhiêu lỗ chân lông lớn?', NOW()),
    (6, 1, 'Bạn mô tả làn da mặt của mình như thế nào?', NOW()),
    (7, 1, 'Khi bạn sử dụng xà phòng tạo bọt mạnh, làn da mặt của bạn phản ứng ra sao?', NOW()),
    (8, 1, 'Nếu không dùng kem dưỡng ẩm, da mặt bạn cảm thấy căng chặt?', NOW()),
    (9, 1, 'Bạn có bị tắc nghẽn lỗ chân lông (mụn đầu đen hoặc đầu trắng)?', NOW()),
    (10, 1, 'Khuôn mặt bạn có nhiều dầu ở vùng chữ T (trán và mũi)?', NOW()),
    (11, 1, 'Hai đến ba giờ sau khi thoa kem dưỡng ẩm, má của bạn trông như thế nào?', NOW()),

    -- Sensitive vs Resistant (cateQuestionID = 2)
    (12, 2, 'Bạn có bị nổi mẩn đỏ trên mặt không?', NOW()),
    (13, 2, 'Các sản phẩm chăm sóc da có làm bạn bị mụn, nổi mẩn, ngứa hoặc rát?', NOW()),
    (14, 2, 'Bạn đã bao giờ được chẩn đoán mắc mụn trứng cá hoặc bệnh rosacea chưa?', NOW()),
    (15, 2, 'Nếu bạn đeo trang sức không phải vàng 14 carat, bạn có bị mẩn ngứa không?', NOW()),
    (16, 2, 'Kem chống nắng làm da bạn ngứa, bỏng, nổi mụn hoặc đỏ không?', NOW()),
    (17, 2, 'Bạn đã bao giờ được chẩn đoán mắc viêm da dị ứng, chàm, hoặc viêm da tiếp xúc?', NOW()),
    (18, 2, 'Bạn có thường bị phát ban dưới nhẫn không?', NOW()),
    (19, 2, 'Sữa tắm có hương thơm, dầu massage hoặc kem dưỡng thể làm da bạn nổi mụn, ngứa, hoặc khô không?', NOW()),
    (20, 2, 'Bạn có thể sử dụng xà phòng trong khách sạn trên cơ thể hoặc mặt mà không gặp vấn đề gì không?', NOW()),
    (21, 2, 'Có ai trong gia đình bạn từng được chẩn đoán mắc viêm da dị ứng, chàm, hen suyễn hoặc dị ứng không?', NOW()),
    (22, 2, 'Điều gì xảy ra nếu bạn sử dụng bột giặt có hương thơm hoặc tấm chống tĩnh điện trong máy sấy?', NOW()),
    (23, 2, 'Mặt và/hoặc cổ của bạn có bị đỏ sau khi tập thể dục vừa phải, hoặc khi căng thẳng không?', NOW()),
    (24, 2, 'Bạn có bị đỏ và bừng mặt sau khi uống rượu không?', NOW()),
    (25, 2, 'Bạn có bị đỏ và bừng mặt sau khi ăn thức ăn cay hoặc đồ uống nóng không?', NOW()),

    -- Pigmented vs Non-Pigmented (cateQuestionID = 3)
    (26, 3, 'Sau khi bạn bị mụn hoặc lông mọc ngược, có xuất hiện đốm nâu đậm hoặc đen không?', NOW()),
    (27, 3, 'Sau khi bị cắt, vết nâu kéo dài bao lâu?', NOW()),
    (28, 3, 'Bạn phát triển bao nhiêu đốm đen trên mặt khi mang thai, uống thuốc tránh thai hoặc HRT?', NOW()),
    (29, 3, 'Bạn có đốm hoặc mảng tối trên môi trên hoặc má không?', NOW()),
    (30, 3, 'Các đốm tối trên mặt bạn có tệ hơn khi tiếp xúc với ánh nắng không?', NOW()),
    (31, 3, 'Bạn đã từng được chẩn đoán bị nám hoặc mảng tối nâu trên mặt chưa?', NOW()),
    (32, 3, 'Bạn có hoặc đã từng có các đốm nâu nhỏ (tàn nhang hoặc đốm do nắng) trên mặt không?', NOW()),
    (33, 3, 'Khi tiếp xúc với ánh nắng lần đầu tiên sau nhiều tháng, làn da của bạn phản ứng ra sao?', NOW()),
    (34, 3, 'Điều gì xảy ra sau khi bạn tiếp xúc với ánh nắng liên tục trong nhiều ngày?', NOW()),
    (35, 3, 'Khi ra nắng, bạn có xuất hiện tàn nhang không?', NOW()),
    (36, 3, 'Một trong hai cha mẹ của bạn có tàn nhang không?', NOW()),
    (37, 3, 'Màu tóc tự nhiên của bạn là gì?', NOW()),
    (38, 3, 'Bạn hoặc người thân trong gia đình bạn có tiền sử bị ung thư da melanoma không?', NOW()),

    -- Wrinkled vs Tight (cateQuestionID = 4)
    (39, 4, 'Bạn có nếp nhăn trên khuôn mặt không?', NOW()),
    (40, 4, 'Da mặt của mẹ bạn trông như thế nào?', NOW()),
    (41, 4, 'Da mặt của bố bạn trông như thế nào?', NOW()),
    (42, 4, 'Da mặt của bà ngoại bạn trông như thế nào?', NOW()),
    (43, 4, 'Da mặt của ông ngoại bạn trông như thế nào?', NOW()),
    (44, 4, 'Da mặt của bà nội bạn trông như thế nào?', NOW()),
    (45, 4, 'Da mặt của ông nội bạn trông như thế nào?', NOW()),
    (46, 4, 'Trong cuộc đời bạn, bạn đã bao giờ rám nắng thường xuyên hơn hai tuần mỗi năm chưa?', NOW()),
    (47, 4, 'Trong cuộc đời bạn, bạn đã từng tham gia hoạt động rám nắng theo mùa kéo dài hai tuần mỗi năm hoặc ít hơn chưa?', NOW()),
    (48, 4, 'Dựa trên nơi bạn từng sống, bạn đã nhận được bao nhiêu ánh nắng mặt trời hàng ngày trong cuộc đời?', NOW()),
    (49, 4, 'Bạn nghĩ mình trông như bao nhiêu tuổi?', NOW()),
    (50, 4, 'Trong 5 năm qua, bạn đã để làn da mình rám nắng một cách có chủ ý như thế nào?', NOW()),
    (51, 4, 'Bạn đã bao giờ sử dụng giường tắm nắng chưa?', NOW()),
    (52, 4, 'Trong suốt cuộc đời, bạn đã hút hoặc tiếp xúc với bao nhiêu điếu thuốc lá?', NOW()),
    (53, 4, 'Mô tả chất lượng không khí nơi bạn sinh sống?', NOW()),
    (54, 4, 'Bạn đã sử dụng kem dưỡng da chứa retinoid trong bao lâu?', NOW()),
    (55, 4, 'Hiện tại bạn ăn trái cây và rau xanh với tần suất thế nào?', NOW()),
    (56, 4, 'Màu da tự nhiên của bạn là gì?', NOW());
-- Câu hỏi 44-64 thuộc Phần 4
INSERT INTO public."KeyQuestion"(
	"keyID", "questionID", "keyContent", "keyScore", "createdAt")
VALUES 
    -- Oily vs Dry (cateQuestionID = 1)
    (1, 1, 'Rất thô ráp, bong tróc hoặc xám xịt', 1, NOW()),
    (2, 1, 'Căng chặt', 2, NOW()),
    (3, 1, 'Dưỡng ẩm tốt, không phản chiếu ánh sáng', 3, NOW()),
    (4, 1, 'Bóng dầu, có ánh sáng phản chiếu', 4, NOW()),

    (5, 2, 'Không bao giờ, hoặc bạn chưa bao giờ để ý', 1, NOW()),
    (6, 2, 'Đôi khi', 2, NOW()),
    (7, 2, 'Thường xuyên', 3, NOW()),
    (8, 2, 'Luôn luôn', 4, NOW()),

    (9, 3, 'Bong tróc hoặc đọng ở nếp nhăn', 1, NOW()),
    (10, 3, 'Mịn màng', 2, NOW()),
    (11, 3, 'Bóng dầu', 3, NOW()),
    (12, 3, 'Loang lổ và bóng dầu', 4, NOW()),
    (13, 3, 'Tôi không dùng kem nền', 2.5, NOW()),

    (14, 4, 'Rất khô hoặc nứt nẻ', 1, NOW()),
    (15, 4, 'Căng chặt', 2, NOW()),
    (16, 4, 'Bình thường', 3, NOW()),
    (17, 4, 'Bóng dầu, hoặc tôi không cần dưỡng ẩm', 4, NOW()),
    (18, 4, 'Không biết', 2.5, NOW()),

    -- Sensitive vs Resistant (cateQuestionID = 2)
    (19, 12, 'Không bao giờ', 1, NOW()),
    (20, 12, 'Hiếm khi', 2, NOW()),
    (21, 12, 'Ít nhất một lần mỗi tháng', 3, NOW()),
    (22, 12, 'Ít nhất một lần mỗi tuần', 4, NOW()),

    (23, 13, 'Không bao giờ', 1, NOW()),
    (24, 13, 'Hiếm khi', 2, NOW()),
    (25, 13, 'Thường xuyên', 3, NOW()),
    (26, 13, 'Luôn luôn', 4, NOW()),
    (27, 13, 'Tôi không dùng sản phẩm chăm sóc da', 2.5, NOW()),

    (28, 14, 'Không', 1, NOW()),
    (29, 14, 'Bạn bè và người quen nói rằng tôi mắc phải', 2, NOW()),
    (30, 14, 'Có', 3, NOW()),
    (31, 14, 'Có, một trường hợp nghiêm trọng', 4, NOW()),
    (32, 14, 'Không chắc chắn', 2.5, NOW()),

    -- Pigmented vs Non-Pigmented (cateQuestionID = 3)
    (33, 26, 'Không bao giờ', 1, NOW()),
    (34, 26, 'Đôi khi', 2, NOW()),
    (35, 26, 'Thường xuyên', 3, NOW()),
    (36, 26, 'Luôn luôn', 4, NOW()),
    (37, 26, 'Tôi không bao giờ bị mụn hoặc lông mọc ngược', 2.5, NOW()),

    (38, 27, 'Tôi không bị vết nâu', 1, NOW()),
    (39, 27, 'Một tuần', 2, NOW()),
    (40, 27, 'Một vài tuần', 3, NOW()),
    (41, 27, 'Vài tháng', 4, NOW()),

    (42, 28, 'Không có', 1, NOW()),
    (43, 28, 'Một', 2, NOW()),
    (44, 28, 'Một vài', 3, NOW()),
    (45, 28, 'Nhiều', 4, NOW()),
    (46, 28, 'Không áp dụng', 2.5, NOW()),

    -- Wrinkled vs Tight (cateQuestionID = 4)
    (47, 39, 'Không, ngay cả khi cử động như cười, nhăn mặt hoặc nhướn mày', 1, NOW()),
    (48, 39, 'Chỉ khi tôi cử động, như cười, nhăn mặt hoặc nhướn mày', 2, NOW()),
    (49, 39, 'Có, khi cử động và một vài nếp nhăn xuất hiện khi không cử động', 3, NOW()),
    (50, 39, 'Có nếp nhăn ngay cả khi tôi không cười, nhăn mặt hoặc nhướn mày', 4, NOW()),

    (51, 40, 'Trẻ hơn 5-10 tuổi so với tuổi của bà', 1, NOW()),
    (52, 40, 'Bằng tuổi', 2, NOW()),
    (53, 40, 'Già hơn 5 tuổi so với tuổi', 3, NOW()),
    (54, 40, 'Già hơn 5 tuổi so với tuổi rất nhiều', 4, NOW()),
    (55, 40, 'Không áp dụng: Tôi được nhận nuôi hoặc không nhớ', 2.5, NOW()),

    (56, 41, 'Trẻ hơn 5-10 tuổi so với tuổi của ông', 1, NOW()),
    (57, 41, 'Bằng tuổi', 2, NOW()),
    (58, 41, 'Già hơn 5 tuổi so với tuổi', 3, NOW()),
    (59, 41, 'Già hơn 5 tuổi so với tuổi rất nhiều', 4, NOW()),
    (60, 41, 'Không áp dụng: Tôi được nhận nuôi hoặc không nhớ', 2.5, NOW());

-- Insert Skintype
INSERT INTO public."SkinType"("skinTypeID", "skinTypeCodes", "skinTypeName", "skinTypeDesc")
VALUES 
(1, 'OSPW', 'Da dầu, nhạy cảm, sắc tố, có nếp nhăn', 
 'Da dễ bị nhờn, dễ kích ứng, có sắc tố như nám hoặc tàn nhang, và dễ có nếp nhăn. Cần sử dụng sản phẩm kiểm soát dầu, chống lão hóa và làm dịu da.'),

(2, 'OSPT', 'Da dầu, nhạy cảm, sắc tố, không có nếp nhăn', 
 'Da dầu, dễ kích ứng, có sắc tố nhưng không có nếp nhăn. Cần sử dụng sản phẩm kiểm soát dầu, giảm viêm và bảo vệ khỏi tia UV.'),

(3, 'OSNW', 'Da dầu, nhạy cảm, không sắc tố, có nếp nhăn', 
 'Da dầu, dễ kích ứng nhưng không có sắc tố, dễ xuất hiện nếp nhăn. Cần chống lão hóa, giảm viêm và kiểm soát dầu.'),

(4, 'OSNT', 'Da dầu, nhạy cảm, không sắc tố, không có nếp nhăn', 
 'Da dầu, dễ kích ứng nhưng không có sắc tố và nếp nhăn. Cần sử dụng sản phẩm nhẹ nhàng, chống viêm và kiểm soát dầu.'),

(5, 'ORPW', 'Da dầu, không nhạy cảm, sắc tố, có nếp nhăn', 
 'Da dầu, ít kích ứng, có sắc tố và dễ hình thành nếp nhăn. Cần tập trung vào chống lão hóa và làm sáng da.'),

(6, 'ORPT', 'Da dầu, không nhạy cảm, sắc tố, không có nếp nhăn', 
 'Da dầu, ít kích ứng, có sắc tố nhưng không có nếp nhăn. Nên sử dụng sản phẩm làm sáng da và kiểm soát dầu.'),

(7, 'ORNW', 'Da dầu, không nhạy cảm, không sắc tố, có nếp nhăn', 
 'Da dầu, ít kích ứng, không có sắc tố nhưng dễ xuất hiện nếp nhăn. Cần chống lão hóa và kiểm soát dầu.'),

(8, 'ORNT', 'Da dầu, không nhạy cảm, không sắc tố, không có nếp nhăn', 
 'Da dầu, ít kích ứng, không có sắc tố hay nếp nhăn. Là loại da khỏe mạnh nhất, chỉ cần duy trì chăm sóc cơ bản.'),

(9, 'DSPW', 'Da khô, nhạy cảm, sắc tố, có nếp nhăn', 
 'Da khô, dễ kích ứng, có sắc tố và dễ có nếp nhăn. Cần dưỡng ẩm mạnh, chống lão hóa và làm dịu da.'),

(10, 'DSPT', 'Da khô, nhạy cảm, sắc tố, không có nếp nhăn', 
 'Da khô, dễ kích ứng, có sắc tố nhưng chưa có nếp nhăn. Cần dưỡng ẩm, làm dịu da và bảo vệ khỏi ánh nắng.'),

(11, 'DSNW', 'Da khô, nhạy cảm, không sắc tố, có nếp nhăn', 
 'Da khô, dễ kích ứng, không có sắc tố nhưng dễ hình thành nếp nhăn. Cần dưỡng ẩm sâu và chống lão hóa.'),

(12, 'DSNT', 'Da khô, nhạy cảm, không sắc tố, không có nếp nhăn', 
 'Da khô, dễ kích ứng, không có sắc tố hay nếp nhăn. Cần sử dụng sản phẩm dưỡng ẩm nhẹ nhàng và làm dịu da.'),

(13, 'DRPW', 'Da khô, không nhạy cảm, sắc tố, có nếp nhăn', 
 'Da khô, ít kích ứng, có sắc tố và dễ hình thành nếp nhăn. Cần tập trung vào dưỡng ẩm, chống lão hóa và làm sáng da.'),

(14, 'DRPT', 'Da khô, không nhạy cảm, sắc tố, không có nếp nhăn', 
 'Da khô, ít kích ứng, có sắc tố nhưng chưa có nếp nhăn. Cần dưỡng ẩm tốt và bảo vệ khỏi ánh nắng.'),

(15, 'DRNW', 'Da khô, không nhạy cảm, không sắc tố, có nếp nhăn', 
 'Da khô, ít kích ứng, không có sắc tố nhưng dễ xuất hiện nếp nhăn. Cần chống lão hóa mạnh và cung cấp độ ẩm sâu.'),

(16, 'DRNT', 'Da khô, không nhạy cảm, không sắc tố, không có nếp nhăn', 
 'Da khô, ít kích ứng, không có sắc tố hay nếp nhăn. Là loại da khỏe mạnh, chỉ cần duy trì dưỡng ẩm cơ bản.');

-- Insert Treatment Solution
INSERT INTO public."TreatmentSolution"("solutionID", "skinTypeID", "solutionContent")
VALUES 
(1, 1, 'Sử dụng sữa rửa mặt dành cho da dầu nhạy cảm. Áp dụng kem chống nắng hàng ngày với SPF 50+. Dùng serum chống oxy hóa và kem dưỡng ẩm nhẹ ban đêm.'),

(2, 2, 'Dùng gel rửa mặt kiểm soát dầu, tránh sản phẩm chứa cồn. Dưỡng ẩm bằng kem chứa niacinamide. Bôi kem chống nắng phổ rộng mỗi ngày.'),

(3, 3, 'Sử dụng sữa rửa mặt dịu nhẹ cho da nhạy cảm. Dùng retinol vào ban đêm để ngăn ngừa nếp nhăn. Dưỡng ẩm với kem giàu ceramide.'),

(4, 4, 'Dùng sữa rửa mặt dạng gel để kiểm soát dầu. Dưỡng ẩm với kem chứa B5 và hyaluronic acid. Bôi kem chống nắng SPF 50+ hàng ngày.'),

(5, 5, 'Dùng sữa rửa mặt kiểm soát dầu có BHA. Áp dụng serum vitamin C để giảm sắc tố. Sử dụng kem dưỡng ẩm chống lão hóa.'),

(6, 6, 'Sử dụng gel rửa mặt nhẹ, tránh sản phẩm làm khô da. Dùng serum vitamin C và kem chống nắng phổ rộng.'),

(7, 7, 'Rửa mặt bằng sữa rửa mặt dịu nhẹ. Dùng kem dưỡng chứa retinol và peptide để giảm nếp nhăn. Bôi kem chống nắng mỗi ngày.'),

(8, 8, 'Chăm sóc cơ bản với sữa rửa mặt nhẹ, kem dưỡng ẩm đơn giản và kem chống nắng. Tập trung bảo vệ da hơn là điều trị.'),

(9, 9, 'Dùng sữa rửa mặt dạng kem để tránh làm mất độ ẩm. Dưỡng ẩm sâu với ceramide và hyaluronic acid. Dùng kem chống nắng dưỡng ẩm.'),

(10, 10, 'Dùng sữa rửa mặt dưỡng ẩm. Sử dụng serum làm dịu da chứa niacinamide. Bôi kem chống nắng dịu nhẹ không chứa cồn.'),

(11, 11, 'Dưỡng ẩm mạnh với kem giàu lipid. Dùng retinol để giảm nếp nhăn. Sử dụng serum chống oxy hóa và kem chống nắng SPF cao.'),

(12, 12, 'Rửa mặt bằng sữa rửa mặt dưỡng ẩm nhẹ. Dùng kem dưỡng chứa B5 và hyaluronic acid. Tránh các sản phẩm chứa cồn.'),

(13, 13, 'Sử dụng kem dưỡng ẩm sâu với peptide. Dùng serum vitamin C để giảm sắc tố. Áp dụng retinol ban đêm và kem chống nắng ban ngày.'),

(14, 14, 'Dưỡng ẩm với kem chứa niacinamide. Sử dụng serum làm sáng da. Dùng kem chống nắng phổ rộng để ngăn ngừa tăng sắc tố.'),

(15, 15, 'Dùng sữa rửa mặt dưỡng ẩm. Áp dụng retinol và peptide để giảm nếp nhăn. Dưỡng ẩm sâu với dầu dưỡng da tự nhiên.'),

(16, 16, 'Duy trì chăm sóc cơ bản với sữa rửa mặt dịu nhẹ, kem dưỡng ẩm đơn giản và kem chống nắng. Tránh các sản phẩm gây kích ứng.');


INSERT INTO public."KeyQuestion"("keyID", "questionID", "keyContent", "keyScore", "createdAt")
VALUES
-- Câu 39: Bạn có nếp nhăn trên khuôn mặt không?
-- (101, 39, 'Không, ngay cả khi cử động như cười, nhăn mặt hoặc nhướn mày.', 1, NOW()),
-- (102, 39, 'Chỉ khi tôi cử động, như cười, nhăn mặt hoặc nhướn mày.', 2, NOW()),
-- (103, 39, 'Có, khi cử động và một vài nếp nhăn xuất hiện khi không cử động.', 3, NOW()),
-- (104, 39, 'Có nếp nhăn ngay cả khi tôi không cười, nhăn mặt hoặc nhướn mày.', 4, NOW())

-- Câu 40: Da mặt của mẹ bạn trông như thế nào?
-- (105, 40, 'Trẻ hơn 5-10 tuổi so với tuổi của bà.', 1, NOW()),
-- (106, 40, 'Bằng tuổi.', 2, NOW()),
-- (107, 40, 'Già hơn 5 tuổi so với tuổi.', 3, NOW()),
-- (108, 40, 'Già hơn 5 tuổi so với tuổi rất nhiều.', 4, NOW()),

-- Câu 41: Da mặt của bố bạn trông như thế nào?
-- (109, 41, 'Trẻ hơn 5-10 tuổi so với tuổi của ông.', 1, NOW()),
-- (110, 41, 'Bằng tuổi.', 2, NOW()),
-- (111, 41, 'Già hơn 5 tuổi so với tuổi.', 3, NOW()),
-- (112, 41, 'Già hơn 5 tuổi so với tuổi rất nhiều.', 4, NOW()),

-- Câu 42: Da mặt của bà ngoại bạn trông như thế nào?
(113, 42, 'Trẻ hơn 5-10 tuổi so với tuổi của bà.', 1, NOW()),
(114, 42, 'Bằng tuổi.', 2, NOW()),
(115, 42, 'Già hơn 5 tuổi so với tuổi.', 3, NOW()),
(116, 42, 'Già hơn 5 tuổi so với tuổi rất nhiều.', 4, NOW()),

-- Câu 43: Da mặt của ông ngoại bạn trông như thế nào?
(117, 43, 'Trẻ hơn 5-10 tuổi so với tuổi của ông.', 1, NOW()),
(118, 43, 'Bằng tuổi.', 2, NOW()),
(119, 43, 'Già hơn 5 tuổi so với tuổi.', 3, NOW()),
(120, 43, 'Già hơn 5 tuổi so với tuổi rất nhiều.', 4, NOW()),

-- Câu 44: Da mặt của bà nội bạn trông như thế nào?
(121, 44, 'Trẻ hơn 5-10 tuổi so với tuổi của bà.', 1, NOW()),
(122, 44, 'Bằng tuổi.', 2, NOW()),
(123, 44, 'Già hơn 5 tuổi so với tuổi.', 3, NOW()),
(124, 44, 'Già hơn 5 tuổi so với tuổi rất nhiều.', 4, NOW()),

-- Câu 45: Da mặt của ông nội bạn trông như thế nào?
(125, 45, 'Trẻ hơn 5-10 tuổi so với tuổi của ông.', 1, NOW()),
(126, 45, 'Bằng tuổi.', 2, NOW()),
(127, 45, 'Già hơn 5 tuổi so với tuổi.', 3, NOW()),
(128, 45, 'Già hơn 5 tuổi so với tuổi rất nhiều.', 4, NOW()),

-- Câu 46: Trong cuộc đời bạn, bạn đã bao giờ rám nắng thường xuyên hơn hai tuần mỗi năm chưa?
(129, 46, 'Không bao giờ.', 1, NOW()),
(130, 46, '1 đến 5 năm.', 2, NOW()),
(131, 46, '5 đến 10 năm.', 3, NOW()),
(132, 46, 'Hơn 10 năm.', 4, NOW()),

-- Câu 47: Trong cuộc đời bạn, bạn đã từng tham gia hoạt động rám nắng theo mùa kéo dài hai tuần mỗi năm hoặc ít hơn chưa?
(133, 47, 'Không bao giờ.', 1, NOW()),
(134, 47, '1 đến 5 năm.', 2, NOW()),
(135, 47, '5 đến 10 năm.', 3, NOW()),
(136, 47, 'Hơn 10 năm.', 4, NOW()),

-- Câu 48: Dựa trên nơi bạn từng sống, bạn đã nhận được bao nhiêu ánh nắng mặt trời hàng ngày trong cuộc đời?
(137, 48, 'Ít; tôi chủ yếu sống ở những nơi có thời tiết u ám.', 1, NOW()),
(138, 48, 'Một ít; tôi đã sống ở những nơi ít nắng và cả những nơi có nắng thường xuyên.', 2, NOW()),
(139, 48, 'Trung bình; tôi đã sống ở những nơi có lượng nắng vừa phải.', 3, NOW()),
(140, 48, 'Rất nhiều; tôi đã sống ở những nơi nhiệt đới hoặc miền Bắc rất nắng.', 4, NOW()),

-- Câu 49: Bạn nghĩ mình trông như bao nhiêu tuổi?
(141, 49, 'Trẻ hơn 1 đến 5 tuổi so với tuổi thực.', 1, NOW()),
(142, 49, 'Bằng tuổi.', 2, NOW()),
(143, 49, 'Già hơn 5 tuổi so với tuổi thực.', 3, NOW()),
(144, 49, 'Già hơn 5 tuổi so với tuổi thực rất nhiều.', 4, NOW());


INSERT INTO public."KeyQuestion"("keyID", "questionID", "keyContent", "keyScore", "createdAt")
VALUES
-- Câu 26: Sau khi bạn bị mụn hoặc lông mọc ngược, có xuất hiện đốm nâu đậm hoặc đen không?
(201, 26, 'Không bao giờ.', 1, NOW()),
(202, 26, 'Đôi khi.', 2, NOW()),
(203, 26, 'Thường xuyên.', 3, NOW()),
(204, 26, 'Luôn luôn.', 4, NOW()),

-- Câu 27: Sau khi bị cắt, vết nâu kéo dài bao lâu?
(205, 27, 'Tôi không bị vết nâu.', 1, NOW()),
(206, 27, 'Một tuần.', 2, NOW()),
(207, 27, 'Một vài tuần.', 3, NOW()),
(208, 27, 'Vài tháng.', 4, NOW()),

-- Câu 28: Bạn phát triển bao nhiêu đốm đen trên mặt khi mang thai, uống thuốc tránh thai hoặc HRT?
(209, 28, 'Không có.', 1, NOW()),
(210, 28, 'Một.', 2, NOW()),
(211, 28, 'Một vài.', 3, NOW()),
(212, 28, 'Nhiều.', 4, NOW()),

-- Câu 29: Bạn có đốm hoặc mảng tối trên môi trên hoặc má không?
(213, 29, 'Không.', 1, NOW()),
(214, 29, 'Tôi không chắc.', 2, NOW()),
(215, 29, 'Có, chúng hơi dễ nhận thấy.', 3, NOW()),
(216, 29, 'Có, chúng rất dễ nhận thấy.', 4, NOW()),

-- Câu 30: Các đốm tối trên mặt bạn có tệ hơn khi tiếp xúc với ánh nắng không?
(217, 30, 'Tôi không có đốm tối.', 1, NOW()),
(218, 30, 'Không chắc chắn.', 2, NOW()),
(219, 30, 'Tệ hơn một chút.', 3, NOW()),
(220, 30, 'Tệ hơn nhiều.', 4, NOW()),

-- Câu 31: Bạn đã từng được chẩn đoán bị nám hoặc mảng tối nâu trên mặt chưa?
(221, 31, 'Không.', 1, NOW()),
(222, 31, 'Một lần, nhưng đã biến mất.', 2, NOW()),
(223, 31, 'Có.', 3, NOW()),
(224, 31, 'Có, một trường hợp nghiêm trọng.', 4, NOW()),

-- Câu 32: Bạn có hoặc đã từng có các đốm nâu nhỏ (tàn nhang hoặc đốm do nắng) trên mặt không?
(225, 32, 'Không.', 1, NOW()),
(226, 32, 'Có, một vài (1 đến 5).', 2, NOW()),
(227, 32, 'Có, nhiều (6 đến 15).', 3, NOW()),
(228, 32, 'Có, rất nhiều (16 hoặc hơn).', 4, NOW()),

-- Câu 33: Khi tiếp xúc với ánh nắng lần đầu tiên sau nhiều tháng, làn da của bạn phản ứng ra sao?
(229, 33, 'Bị cháy nắng.', 1, NOW()),
(230, 33, 'Bị cháy nắng sau đó sẫm màu hơn.', 2, NOW()),
(231, 33, 'Sẫm màu hơn.', 3, NOW()),
(232, 33, 'Da tôi đã tối màu, nên khó thấy sự thay đổi.', 4, NOW()),

-- Câu 34: Điều gì xảy ra sau khi bạn tiếp xúc với ánh nắng liên tục trong nhiều ngày?
(233, 34, 'Tôi bị cháy nắng và phồng rộp, nhưng màu da không thay đổi.', 1, NOW()),
(234, 34, 'Da tôi sẫm màu hơn một chút.', 2, NOW()),
(235, 34, 'Da tôi sẫm màu hơn nhiều.', 3, NOW()),
(236, 34, 'Da tôi đã tối màu, nên khó thấy sự thay đổi.', 4, NOW()),

-- Câu 35: Khi ra nắng, bạn có xuất hiện tàn nhang không?
(237, 35, 'Không, tôi không bao giờ bị tàn nhang.', 1, NOW()),
(238, 35, 'Tôi có thêm một vài tàn nhang nhỏ mới mỗi năm.', 2, NOW()),
(239, 35, 'Tôi thường xuyên phát triển tàn nhang mới.', 3, NOW()),
(240, 35, 'Da tôi đã tối màu, nên khó thấy sự thay đổi.', 4, NOW()),

-- Câu 36: Một trong hai cha mẹ của bạn có tàn nhang không?
(241, 36, 'Không.', 1, NOW()),
(242, 36, 'Một vài trên khuôn mặt.', 2, NOW()),
(243, 36, 'Nhiều trên khuôn mặt.', 3, NOW()),
(244, 36, 'Nhiều trên mặt, ngực, cổ và vai.', 4, NOW()),

-- Câu 37: Màu tóc tự nhiên của bạn là gì?
(245, 37, 'Vàng.', 1, NOW()),
(246, 37, 'Nâu.', 2, NOW()),
(247, 37, 'Đen.', 3, NOW()),
(248, 37, 'Đỏ.', 4, NOW()),

-- Câu 38: Bạn hoặc người thân trong gia đình bạn có tiền sử bị ung thư da melanoma không?
(249, 38, 'Không.', 1, NOW()),
(250, 38, '1 người trong gia đình tôi.', 2, NOW()),
(251, 38, 'Hơn 1 người trong gia đình tôi.', 3, NOW()),
(252, 38, 'Tôi có tiền sử bị ung thư da melanoma.', 4, NOW());


INSERT INTO public."KeyQuestion"("keyID", "questionID", "keyContent", "keyScore", "createdAt")
VALUES
-- Câu 12: Bạn có bị nổi mẩn đỏ trên mặt không?
(351, 12, 'Không bao giờ.', 1, NOW()),
(352, 12, 'Hiếm khi.', 2, NOW()),
(353, 12, 'Ít nhất một lần mỗi tháng.', 3, NOW()),
(354, 12, 'Ít nhất một lần mỗi tuần.', 4, NOW()),

-- Câu 13: Các sản phẩm chăm sóc da có làm bạn bị mụn, nổi mẩn, ngứa hoặc rát không?
(355, 13, 'Không bao giờ.', 1, NOW()),
(356, 13, 'Hiếm khi.', 2, NOW()),
(357, 13, 'Thường xuyên.', 3, NOW()),
(358, 13, 'Luôn luôn.', 4, NOW()),

-- Câu 14: Bạn đã bao giờ được chẩn đoán mắc mụn trứng cá hoặc bệnh rosacea chưa?
(359, 14, 'Không.', 1, NOW()),
(360, 14, 'Bạn bè và người quen nói rằng tôi mắc phải.', 2, NOW()),
(361, 14, 'Có.', 3, NOW()),
(362, 14, 'Có, một trường hợp nghiêm trọng.', 4, NOW()),

-- Câu 15: Nếu bạn đeo trang sức không phải vàng 14 carat, bạn có bị mẩn ngứa không?
(363, 15, 'Không bao giờ.', 1, NOW()),
(364, 15, 'Hiếm khi.', 2, NOW()),
(365, 15, 'Thường xuyên.', 3, NOW()),
(366, 15, 'Luôn luôn.', 4, NOW()),

-- Câu 16: Kem chống nắng làm da bạn ngứa, bỏng, nổi mụn hoặc đỏ không?
(367, 16, 'Không bao giờ.', 1, NOW()),
(368, 16, 'Hiếm khi.', 2, NOW()),
(369, 16, 'Thường xuyên.', 3, NOW()),
(370, 16, 'Luôn luôn.', 4, NOW()),

-- Câu 17: Bạn đã bao giờ được chẩn đoán mắc viêm da dị ứng, chàm, hoặc viêm da tiếp xúc?
(371, 17, 'Không.', 1, NOW()),
(372, 17, 'Bạn bè nói rằng tôi mắc phải.', 2, NOW()),
(373, 17, 'Có.', 3, NOW()),
(374, 17, 'Có, một trường hợp nghiêm trọng.', 4, NOW()),

-- Câu 18: Bạn có thường bị phát ban dưới nhẫn không?
(375, 18, 'Không bao giờ.', 1, NOW()),
(376, 18, 'Hiếm khi.', 2, NOW()),
(377, 18, 'Thường xuyên.', 3, NOW()),
(378, 18, 'Luôn luôn.', 4, NOW()),

-- Câu 19: Sữa tắm có hương thơm, dầu massage hoặc kem dưỡng thể làm da bạn nổi mụn, ngứa, hoặc khô không?
(379, 19, 'Không bao giờ.', 1, NOW()),
(380, 19, 'Hiếm khi.', 2, NOW()),
(381, 19, 'Thường xuyên.', 3, NOW()),
(382, 19, 'Luôn luôn.', 4, NOW()),

-- Câu 20: Bạn có thể sử dụng xà phòng trong khách sạn trên cơ thể hoặc mặt mà không gặp vấn đề gì không?
(383, 20, 'Có.', 1, NOW()),
(384, 20, 'Hầu hết thời gian tôi không gặp vấn đề.', 2, NOW()),
(385, 20, 'Không, da tôi ngứa, đỏ, hoặc nổi mụn.', 3, NOW()),
(386, 20, 'Tôi không dùng nó. Tôi đã gặp quá nhiều vấn đề trước đây!', 4, NOW()),

-- Câu 21: Có ai trong gia đình bạn từng được chẩn đoán mắc viêm da dị ứng, chàm, hen suyễn hoặc dị ứng không?
(387, 21, 'Không.', 1, NOW()),
(388, 21, 'Một người thân trong gia đình mà tôi biết.', 2, NOW()),
(389, 21, 'Một vài người thân trong gia đình.', 3, NOW()),
(390, 21, 'Nhiều người thân trong gia đình mắc viêm da, chàm, hen suyễn, hoặc dị ứng.', 4, NOW()),

-- Câu 22: Điều gì xảy ra nếu bạn sử dụng bột giặt có hương thơm hoặc tấm chống tĩnh điện trong máy sấy?
(391, 22, 'Da tôi bình thường.', 1, NOW()),
(392, 22, 'Da tôi hơi khô.', 2, NOW()),
(393, 22, 'Da tôi ngứa.', 3, NOW()),
(394, 22, 'Da tôi ngứa và bị phát ban.', 4, NOW()),

-- Câu 23: Mặt và/hoặc cổ của bạn có bị đỏ sau khi tập thể dục vừa phải, hoặc khi căng thẳng không?
(395, 23, 'Không bao giờ.', 1, NOW()),
(396, 23, 'Đôi khi.', 2, NOW()),
(397, 23, 'Thường xuyên.', 3, NOW()),
(398, 23, 'Luôn luôn.', 4, NOW()),

-- Câu 24: Bạn có bị đỏ và bừng mặt sau khi uống rượu không?
(399, 24, 'Không bao giờ.', 1, NOW()),
(400, 24, 'Đôi khi.', 2, NOW()),
(401, 24, 'Thường xuyên.', 3, NOW()),
(402, 24, 'Luôn luôn.', 4, NOW()),

-- Câu 25: Bạn có bị đỏ và bừng mặt sau khi ăn thức ăn cay hoặc đồ uống nóng không?
(403, 25, 'Không bao giờ.', 1, NOW()),
(404, 25, 'Đôi khi.', 2, NOW()),
(405, 25, 'Thường xuyên.', 3, NOW()),
(406, 25, 'Luôn luôn.', 4, NOW());



INSERT INTO public."KeyQuestion"("keyID", "questionID", "keyContent", "keyScore", "createdAt")
VALUES
-- Câu 1: Sau khi rửa mặt mà không thoa dưỡng ẩm, kem chống nắng,..., sau 2-3 giờ, trán và má của bạn trông hoặc cảm thấy thế nào?
(500, 1, 'Da trông khô và căng.', 1, NOW()),
(501, 1, 'Da hơi căng, nhưng không quá khô.', 2, NOW()),
(502, 1, 'Da có chút dầu ở vùng chữ T.', 3, NOW()),
(503, 1, 'Da dầu toàn mặt.', 4, NOW()),

-- Câu 2: Trong ảnh, mặt bạn trông bóng dầu như thế nào?
(504, 2, 'Không bóng dầu.', 1, NOW()),
(505, 2, 'Hơi bóng một chút.', 2, NOW()),
(506, 2, 'Bóng dầu ở vùng chữ T.', 3, NOW()),
(507, 2, 'Rất bóng dầu.', 4, NOW()),

-- Câu 3: Sau khi thoa kem nền mà không dùng phấn phủ, lớp trang điểm của bạn sau 2-3 giờ ra sao?
(508, 3, 'Lớp nền vẫn khô ráo, không đổi.', 1, NOW()),
(509, 3, 'Hơi bóng nhẹ nhưng không quá nhiều.', 2, NOW()),
(510, 3, 'Bóng dầu rõ ở vùng chữ T.', 3, NOW()),
(511, 3, 'Rất bóng, cần thấm dầu hoặc dặm lại.', 4, NOW()),

-- Câu 4: Khi ở nơi độ ẩm thấp, nếu bạn không dùng kem dưỡng ẩm, da mặt bạn như thế nào?
(512, 4, 'Rất khô, căng và có thể bong tróc.', 1, NOW()),
(513, 4, 'Hơi khô và căng nhẹ.', 2, NOW()),
(514, 4, 'Không thấy khác biệt.', 3, NOW()),
(515, 4, 'Da vẫn dầu bình thường.', 4, NOW()),

-- Câu 5: Nhìn vào gương phóng đại, bạn có bao nhiêu lỗ chân lông lớn?
(516, 5, 'Không có lỗ chân lông lớn.', 1, NOW()),
(517, 5, 'Một vài lỗ chân lông to ở vùng mũi.', 2, NOW()),
(518, 5, 'Lỗ chân lông to rõ ràng ở vùng chữ T.', 3, NOW()),
(519, 5, 'Lỗ chân lông to trên toàn mặt.', 4, NOW()),

-- Câu 6: Bạn mô tả làn da mặt của mình như thế nào?
(520, 6, 'Rất khô.', 1, NOW()),
(521, 6, 'Hơi khô.', 2, NOW()),
(522, 6, 'Bình thường.', 3, NOW()),
(523, 6, 'Rất dầu.', 4, NOW()),

-- Câu 7: Khi bạn sử dụng xà phòng tạo bọt mạnh, làn da mặt của bạn phản ứng ra sao?
(524, 7, 'Da bị khô và căng ngay lập tức.', 1, NOW()),
(525, 7, 'Hơi khô nhưng không quá căng.', 2, NOW()),
(526, 7, 'Không thấy khác biệt.', 3, NOW()),
(527, 7, 'Da vẫn dầu như bình thường.', 4, NOW()),

-- Câu 8: Nếu không dùng kem dưỡng ẩm, da mặt bạn cảm thấy căng chặt?
(528, 8, 'Rất căng và khó chịu.', 1, NOW()),
(529, 8, 'Hơi căng nhưng vẫn ổn.', 2, NOW()),
(530, 8, 'Không căng, da vẫn bình thường.', 3, NOW()),
(531, 8, 'Không hề căng, da dầu.', 4, NOW()),

-- Câu 9: Bạn có bị tắc nghẽn lỗ chân lông (mụn đầu đen hoặc đầu trắng)?
(532, 9, 'Không bao giờ.', 1, NOW()),
(533, 9, 'Hiếm khi.', 2, NOW()),
(534, 9, 'Thỉnh thoảng.', 3, NOW()),
(535, 9, 'Thường xuyên.', 4, NOW()),

-- Câu 10: Khuôn mặt bạn có nhiều dầu ở vùng chữ T (trán và mũi)?
(536, 10, 'Không bao giờ.', 1, NOW()),
(537, 10, 'Hiếm khi.', 2, NOW()),
(538, 10, 'Thỉnh thoảng.', 3, NOW()),
(539, 10, 'Luôn luôn.', 4, NOW()),

-- Câu 11: Hai đến ba giờ sau khi thoa kem dưỡng ẩm, má của bạn trông như thế nào?
(540, 11, 'Rất khô.', 1, NOW()),
(541, 11, 'Hơi khô.', 2, NOW()),
(542, 11, 'Bình thường.', 3, NOW()),
(543, 11, 'Bóng dầu.', 4, NOW());


INSERT INTO public."EventDetail"(
	"eventDetailID", "productID", "eventID")
	VALUES (1, 6, 1);
INSERT INTO public."EventDetail"(
	"eventDetailID", "productID", "eventID")
	VALUES (2, 7, 1);
INSERT INTO public."EventDetail"(
	"eventDetailID", "productID", "eventID")
	VALUES (3, 8, 1);
INSERT INTO public."EventDetail"(
	"eventDetailID", "productID", "eventID")
	VALUES (4, 9, 1);