CREATE TABLE "Account" (
  "accID" BIGSERIAL PRIMARY KEY NOT NULL,
  "roleID" SMALLINT NOT NULL,
  "accStatusID" SMALLINT NOT NULL,
  "username" VARCHAR(255) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL DEFAULT '255'
);

CREATE TABLE "User" (
  "usrID" BIGSERIAL PRIMARY KEY NOT NULL,
  "fullname" VARCHAR(255),
  "gender" SMALLINT,
  "phone" VARCHAR(255) UNIQUE,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "dob" DATE,
  "createdAt" TIMESTAMP(0) NOT NULL,
  "updatedAt" TIMESTAMP(0) NOT NULL,
  "emailVerifyToken" VARCHAR(500) UNIQUE,
  "forgotPasswordToken" VARCHAR(500) UNIQUE,
  "avatarUrl" VARCHAR(500),
  "coverUrl" VARCHAR(500),
  "rewardPoint" SMALLINT NOT NULL DEFAULT '0'
);

CREATE TABLE "Role" (
  "roleID" SMALLINT PRIMARY KEY NOT NULL,
  "roleName" VARCHAR(255) NOT NULL,
  "roleStatus" BOOLEAN NOT NULL
);

CREATE TABLE "AccountStatus" (
  "accStatusID" SMALLSERIAL PRIMARY KEY NOT NULL,
  "statusName" VARCHAR(255) NOT NULL
);

CREATE TABLE "Address" (
  "addressID" BIGSERIAL PRIMARY KEY NOT NULL,
  "usrID" BIGINT NOT NULL,
  "addDetail" VARCHAR(255) NOT NULL,
  "ward" VARCHAR(255) NOT NULL,
  "district" VARCHAR(255) NOT NULL,
  "city" VARCHAR(255) NOT NULL,
  "country" VARCHAR(255) NOT NULL,
  "isDefault" BOOLEAN NOT NULL,
  "status" BOOLEAN NOT NULL
);

CREATE TABLE "SkinType" (
  "skinTypeID" SMALLSERIAL PRIMARY KEY NOT NULL,
  "skinTypeCodes" VARCHAR(255) NOT NULL,
  "skinTypeName" VARCHAR(255) NOT NULL,
  "skinTypeDesc" TEXT NOT NULL
);

CREATE TABLE "CategoryQuestion" (
  "cateQuestionID" SMALLSERIAL PRIMARY KEY NOT NULL,
  "cateName" VARCHAR(255) NOT NULL,
  "cateDesc" TEXT NOT NULL,
  "createdAt" DATE NOT NULL
);

CREATE TABLE "Product" (
  "productID" BIGSERIAL PRIMARY KEY NOT NULL,
  "cateID" SMALLSERIAL NOT NULL,
  "brandID" BIGINT NOT NULL,
  "productName" VARCHAR(255) NOT NULL,
  "productDesc" TEXT,
  "stocks" INTEGER NOT NULL DEFAULT '0',
  "costPrice" FLOAT(53) NOT NULL DEFAULT '0',
  "sellPrice" FLOAT(53) NOT NULL DEFAULT '0',
  "discountedPrice" FLOAT(53) NOT NULL DEFAULT '0',
  "totalRating" FLOAT(53),
  "ingredient" TEXT NOT NULL,
  "instruction" TEXT NOT NULL,
  "prodUseFor" TEXT,
  "prodStatusID" SMALLINT NOT NULL,
  "createdAt" TIMESTAMP(0) NOT NULL,
  "updatedAt" TIMESTAMP(0) NOT NULL,
  "totalSold" SMALLINT NOT NULL DEFAULT '0',
  "totalReview" SMALLINT NOT NULL DEFAULT '0'
);

CREATE TABLE "Brand" (
  "brandID" BIGSERIAL PRIMARY KEY NOT NULL,
  "brandName" VARCHAR(255) NOT NULL,
  "brandDesc" TEXT,
  "brandOrigin" VARCHAR(255) NOT NULL,
  "brandStatus" BOOLEAN NOT NULL,
  "isDeleted" BOOLEAN NOT NULL
);

CREATE TABLE "CategoryProduct" (
  "cateProdID" SMALLSERIAL PRIMARY KEY NOT NULL,
  "cateProdName" VARCHAR(255) NOT NULL,
  "cateProdStatus" BOOLEAN NOT NULL
);

CREATE TABLE "Review" (
  "reviewID" BIGSERIAL PRIMARY KEY NOT NULL,
  "reviewContent" TEXT NOT NULL,
  "usrID" BIGINT NOT NULL,
  "prodID" BIGINT NOT NULL,
  "rating" FLOAT(53) NOT NULL,
  "createdAt" TIMESTAMP(0) NOT NULL,
  "updatedAt" TIMESTAMP(0) NOT NULL
);

CREATE TABLE "Payment" (
  "paymentID" BIGSERIAL PRIMARY KEY NOT NULL,
  "orderID" BIGINT NOT NULL,
  "paymentMethod" VARCHAR NOT NULL,
  "paymentAmount" FLOAT(53) NOT NULL,
  "paymentStatus" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP(0)
);

CREATE TABLE "Order" (
  "ordID" BIGSERIAL PRIMARY KEY NOT NULL,
  "usrID" BIGINT NOT NULL,
  "eventID" BIGINT,
  "ordDate" TIMESTAMP(0) NOT NULL,
  "ordStatusID" SMALLINT NOT NULL,
  "totalOrdPrice" FLOAT(53) NOT NULL,
  "createdAt" TIMESTAMP(0) NOT NULL,
  "updatedAt" TIMESTAMP(0) NOT NULL,
  "isPaid" BOOLEAN NOT NULL,
  "voucherCodeApplied" VARCHAR(255) UNIQUE
);

CREATE TABLE "OrderDetail" (
  "ordDetailID" BIGSERIAL PRIMARY KEY NOT NULL,
  "ordID" BIGINT NOT NULL,
  "prodID" BIGINT NOT NULL,
  "quantity" SMALLINT NOT NULL,
  "sellPrice" FLOAT(53) NOT NULL
);

CREATE TABLE "DeliveryDetail" (
  "deliID" BIGSERIAL PRIMARY KEY NOT NULL,
  "deliServiceID" BIGINT NOT NULL,
  "addressID" BIGINT NOT NULL,
  "deliPhone" VARCHAR(255) NOT NULL,
  "ordID" BIGINT NOT NULL,
  "deliStatus" BOOLEAN NOT NULL,
  "createAt" TIMESTAMP(0) NOT NULL
);

CREATE TABLE "OrderStatus" (
  "ordStatusID" SMALLINT PRIMARY KEY NOT NULL,
  "ordStatusName" VARCHAR(255) NOT NULL
);

CREATE TABLE "DeliveryService" (
  "DeliServiceID" BIGSERIAL PRIMARY KEY NOT NULL,
  "contactService" VARCHAR(255) NOT NULL,
  "DeliServiceName" VARCHAR(255) NOT NULL,
  "deliServiceStatus" BOOLEAN NOT NULL
);

CREATE TABLE "OrderLog" (
  "ordLogID" BIGSERIAL PRIMARY KEY NOT NULL,
  "newStatusOrdID" SMALLINT NOT NULL,
  "ordID" BIGINT NOT NULL,
  "usrID" BIGINT NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(0) NOT NULL
);

CREATE TABLE "WarantyOrder" (
  "warantyID" BIGSERIAL PRIMARY KEY NOT NULL,
  "ordID" BIGINT NOT NULL,
  "createdAt" TIMESTAMP(0) NOT NULL,
  "endDate" TIMESTAMP(0) NOT NULL
);

CREATE TABLE "Event" (
  "eventID" BIGSERIAL PRIMARY KEY NOT NULL,
  "eventName" VARCHAR(255) NOT NULL,
  "startTime" TIMESTAMP(0) NOT NULL,
  "endTime" TIMESTAMP(0) NOT NULL,
  "eventDesc" TEXT,
  "discountPercent" FLOAT(53) NOT NULL,
  "statusEvent" BOOLEAN NOT NULL
);

CREATE TABLE "EventDetail" (
  "eventDetailID" BIGSERIAL PRIMARY KEY NOT NULL,
  "productID" BIGINT NOT NULL,
  "eventID" BIGINT NOT NULL
);

CREATE TABLE "Voucher" (
  "voucherID" BIGSERIAL PRIMARY KEY NOT NULL,
  "voucherCode" VARCHAR(255) UNIQUE NOT NULL,
  "voucherDiscount" FLOAT(53) NOT NULL,
  "usrID" BIGINT NOT NULL,
  "voucherDesc" TEXT NOT NULL,
  "statusVoucher" BOOLEAN NOT NULL
);

CREATE TABLE "Quiz" (
  "quizID" BIGSERIAL PRIMARY KEY NOT NULL,
  "quizName" VARCHAR(255) NOT NULL,
  "quizDesc" TEXT NOT NULL,
  "createdAt" DATE NOT NULL
);

CREATE TABLE "Question" (
  "questionID" SMALLSERIAL PRIMARY KEY NOT NULL,
  "cateQuestionID" smallint NOT NULL,
  "questionContent" TEXT NOT NULL,
  "createdAt" DATE NOT NULL,
  "statusQuestion" BOOLEAN NOT NULL DEFAULT '1'
);

CREATE TABLE "QuizDetail" (
  "detailID" BIGINT PRIMARY KEY NOT NULL,
  "questID" SMALLSERIAL NOT NULL,
  "quizID" BIGINT NOT NULL
);

CREATE TABLE "ResultQuiz" (
  "resultID" BIGSERIAL PRIMARY KEY NOT NULL,
  "quizID" BIGINT NOT NULL,
  "usrID" BIGINT NOT NULL,
  "ODScore" SMALLINT NOT NULL DEFAULT '0',
  "SRScore" SMALLINT NOT NULL DEFAULT '0',
  "PNPScore" SMALLINT NOT NULL DEFAULT '0',
  "WTScore" SMALLINT NOT NULL DEFAULT '0',
  "skinTypeID" SMALLSERIAL NOT NULL,
  "createAt" TIMESTAMP(0) NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT '1'
);

CREATE TABLE "KeyQuestion" (
  "keyID" SMALLSERIAL PRIMARY KEY NOT NULL,
  "questionID" SMALLSERIAL NOT NULL,
  "keyContent" TEXT NOT NULL,
  "keyScore" SMALLINT NOT NULL,
  "createdAt" DATE NOT NULL,
  "keyQuestionStatus" BOOLEAN NOT NULL DEFAULT '1'
);

CREATE TABLE "ResultDetail" (
  "resultDetailID" BIGSERIAL PRIMARY KEY NOT NULL,
  "resultID" BIGINT NOT NULL,
  "keyID" SMALLINT NOT NULL
);

CREATE TABLE "ReturnProduct" (
  "returnID" BIGSERIAL PRIMARY KEY NOT NULL,
  "ordIDd" BIGINT NOT NULL,
  "usrID" BIGINT NOT NULL,
  "returnDate" DATE NOT NULL,
  "refundAmount" FLOAT(53) NOT NULL,
  "returnStatus" BOOLEAN NOT NULL
);

CREATE TABLE "ReturnProductDetail" (
  "returnProdDetailID" BIGSERIAL PRIMARY KEY NOT NULL,
  "prodIDre" BIGINT NOT NULL,
  "returnID" BIGINT NOT NULL,
  "returnImgUrl" VARCHAR(255) NOT NULL,
  "returnQuantity" SMALLINT NOT NULL
);

CREATE TABLE "ProductImage" (
  "prodImageID" BIGSERIAL PRIMARY KEY NOT NULL,
  "prodID" BIGINT NOT NULL,
  "prodImageUrl" VARCHAR(255) NOT NULL
);

CREATE TABLE "RecommendFor" (
  "recForID" BIGSERIAL PRIMARY KEY NOT NULL,
  "prodID" BIGINT NOT NULL,
  "skinTypeID" SMALLINT NOT NULL
);

CREATE TABLE "ProductStatus" (
  "prodStatusID" SMALLSERIAL PRIMARY KEY NOT NULL,
  "prodStatusName" VARCHAR(255) NOT NULL
);

CREATE TABLE "TreatmentSolution" (
  "solutionID" SMALLSERIAL PRIMARY KEY NOT NULL,
  "skinTypeID" SMALLINT NOT NULL,
  "solutionContent" TEXT NOT NULL
);

COMMENT ON COLUMN "User"."rewardPoint" IS '0-250: Bronze rank
250-1500: Silver rank
Over 1500: Gold rank';

COMMENT ON COLUMN "SkinType"."skinTypeCodes" IS 'Mã loại da (ví dụ: "OSPT", "DRNW").';

COMMENT ON COLUMN "SkinType"."skinTypeName" IS 'Tên loại da đầy đủ (ví dụ: "Oily, Sensitive, Pigmented, Tight").';

COMMENT ON COLUMN "SkinType"."skinTypeDesc" IS 'Mô tả chi tiết về loại da.';

COMMENT ON COLUMN "DeliveryDetail"."deliStatus" IS 'Just manage 2 status: Success / False';

COMMENT ON COLUMN "ResultQuiz"."ODScore" IS 'OilyDryScore';

COMMENT ON COLUMN "ResultQuiz"."SRScore" IS 'SensitiveResistantScore';

COMMENT ON COLUMN "ResultQuiz"."PNPScore" IS 'PigmentedNonPigmentedScore';

COMMENT ON COLUMN "ResultQuiz"."WTScore" IS 'WrinkledTightScore';

ALTER TABLE "Review" ADD CONSTRAINT "comment_prodid_foreign" FOREIGN KEY ("prodID") REFERENCES "Product" ("productID");

ALTER TABLE "Product" ADD CONSTRAINT "product_prodstatusid_foreign" FOREIGN KEY ("prodStatusID") REFERENCES "ProductStatus" ("prodStatusID");

ALTER TABLE "Product" ADD CONSTRAINT "product_brandid_foreign" FOREIGN KEY ("brandID") REFERENCES "Brand" ("brandID");

ALTER TABLE "DeliveryDetail" ADD CONSTRAINT "deliverydetail_deliserviceid_foreign" FOREIGN KEY ("deliServiceID") REFERENCES "DeliveryService" ("DeliServiceID");

ALTER TABLE "ResultQuiz" ADD CONSTRAINT "resultquiz_skintypeid_foreign" FOREIGN KEY ("skinTypeID") REFERENCES "SkinType" ("skinTypeID");

ALTER TABLE "Product" ADD CONSTRAINT "product_cateid_foreign" FOREIGN KEY ("cateID") REFERENCES "CategoryProduct" ("cateProdID");

ALTER TABLE "TreatmentSolution" ADD CONSTRAINT "treatmentsolution_skintypeid_foreign" FOREIGN KEY ("skinTypeID") REFERENCES "SkinType" ("skinTypeID");

ALTER TABLE "ReturnProduct" ADD CONSTRAINT "returnproduct_ordidd_foreign" FOREIGN KEY ("ordIDd") REFERENCES "Order" ("ordID");

ALTER TABLE "KeyQuestion" ADD CONSTRAINT "keyquestion_questionid_foreign" FOREIGN KEY ("questionID") REFERENCES "Question" ("questionID");

ALTER TABLE "ReturnProduct" ADD CONSTRAINT "returnproduct_usrid_foreign" FOREIGN KEY ("usrID") REFERENCES "User" ("usrID");

ALTER TABLE "QuizDetail" ADD CONSTRAINT "quizdetail_quizid_foreign" FOREIGN KEY ("quizID") REFERENCES "Quiz" ("quizID");

ALTER TABLE "WarantyOrder" ADD CONSTRAINT "warantyorder_ordid_foreign" FOREIGN KEY ("ordID") REFERENCES "Order" ("ordID");

ALTER TABLE "Payment" ADD CONSTRAINT "payment_ordid_foreign" FOREIGN KEY ("orderID") REFERENCES "Order" ("ordID");

ALTER TABLE "Order" ADD CONSTRAINT "order_usrid_foreign" FOREIGN KEY ("usrID") REFERENCES "User" ("usrID");

ALTER TABLE "OrderLog" ADD CONSTRAINT "orderlog_newstatusordid_foreign" FOREIGN KEY ("newStatusOrdID") REFERENCES "OrderStatus" ("ordStatusID");

ALTER TABLE "QuizDetail" ADD CONSTRAINT "quizdetail_questid_foreign" FOREIGN KEY ("questID") REFERENCES "Question" ("questionID");

ALTER TABLE "Order" ADD CONSTRAINT "order_eventid_foreign" FOREIGN KEY ("eventID") REFERENCES "Event" ("eventID");

ALTER TABLE "ResultDetail" ADD CONSTRAINT "resultdetail_resultid_foreign" FOREIGN KEY ("resultID") REFERENCES "ResultQuiz" ("resultID");

ALTER TABLE "ProductImage" ADD CONSTRAINT "productimage_prodid_foreign" FOREIGN KEY ("prodID") REFERENCES "Product" ("productID");

ALTER TABLE "Order" ADD CONSTRAINT "order_ordstatusid_foreign" FOREIGN KEY ("ordStatusID") REFERENCES "OrderStatus" ("ordStatusID");

ALTER TABLE "Address" ADD CONSTRAINT "address_usrid_foreign" FOREIGN KEY ("usrID") REFERENCES "User" ("usrID");

ALTER TABLE "DeliveryDetail" ADD CONSTRAINT "deliverydetail_ordid_foreign" FOREIGN KEY ("ordID") REFERENCES "Order" ("ordID");

ALTER TABLE "Question" ADD CONSTRAINT "question_catequestionid_foreign" FOREIGN KEY ("cateQuestionID") REFERENCES "CategoryQuestion" ("cateQuestionID");

ALTER TABLE "ReturnProductDetail" ADD CONSTRAINT "returnproductdetail_returnid_foreign" FOREIGN KEY ("returnID") REFERENCES "ReturnProduct" ("returnID");

ALTER TABLE "EventDetail" ADD CONSTRAINT "eventdetail_eventid_foreign" FOREIGN KEY ("eventID") REFERENCES "Event" ("eventID");

ALTER TABLE "ResultDetail" ADD CONSTRAINT "resultdetail_keyid_foreign" FOREIGN KEY ("keyID") REFERENCES "KeyQuestion" ("keyID");

ALTER TABLE "OrderLog" ADD CONSTRAINT "orderlog_ordid_foreign" FOREIGN KEY ("ordID") REFERENCES "Order" ("ordID");

ALTER TABLE "Account" ADD CONSTRAINT "account_roleid_foreign" FOREIGN KEY ("roleID") REFERENCES "Role" ("roleID");

ALTER TABLE "RecommendFor" ADD CONSTRAINT "recommendfor_skintypeid_foreign" FOREIGN KEY ("skinTypeID") REFERENCES "SkinType" ("skinTypeID");

ALTER TABLE "ResultQuiz" ADD CONSTRAINT "resultquiz_quizid_foreign" FOREIGN KEY ("quizID") REFERENCES "Quiz" ("quizID");

ALTER TABLE "DeliveryDetail" ADD CONSTRAINT "deliverydetail_addressid_foreign" FOREIGN KEY ("addressID") REFERENCES "Address" ("addressID");

ALTER TABLE "ResultQuiz" ADD CONSTRAINT "resultquiz_usrid_foreign" FOREIGN KEY ("usrID") REFERENCES "User" ("usrID");

ALTER TABLE "Account" ADD CONSTRAINT "account_accstatusid_foreign" FOREIGN KEY ("accStatusID") REFERENCES "AccountStatus" ("accStatusID");

ALTER TABLE "User" ADD CONSTRAINT "user_usrid_foreign" FOREIGN KEY ("usrID") REFERENCES "Account" ("accID");

ALTER TABLE "ReturnProductDetail" ADD CONSTRAINT "returnproductdetail_prodidre_foreign" FOREIGN KEY ("prodIDre") REFERENCES "Product" ("productID");

ALTER TABLE "Voucher" ADD CONSTRAINT "voucher_usrid_foreign" FOREIGN KEY ("usrID") REFERENCES "User" ("usrID");

ALTER TABLE "OrderDetail" ADD CONSTRAINT "orderdetail_prodid_foreign" FOREIGN KEY ("prodID") REFERENCES "Product" ("productID");

ALTER TABLE "OrderDetail" ADD CONSTRAINT "orderdetail_ordid_foreign" FOREIGN KEY ("ordID") REFERENCES "Order" ("ordID");

ALTER TABLE "EventDetail" ADD CONSTRAINT "eventdetail_productid_foreign" FOREIGN KEY ("productID") REFERENCES "Product" ("productID");

ALTER TABLE "RecommendFor" ADD CONSTRAINT "recommendfor_prodid_foreign" FOREIGN KEY ("prodID") REFERENCES "Product" ("productID");
