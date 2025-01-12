using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20250113011010 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Job");

            migrationBuilder.DropTable(
                name: "user_roles");

            migrationBuilder.DropPrimaryKey(
                name: "users_pkey",
                table: "users");

            migrationBuilder.DropIndex(
                name: "users_email_key",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "roles_pkey",
                table: "roles");

            migrationBuilder.DropIndex(
                name: "roles_role_name_key",
                table: "roles");

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "users");

            migrationBuilder.DropColumn(
                name: "name",
                table: "users");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "roles");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "User");

            migrationBuilder.RenameTable(
                name: "roles",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "role_name",
                table: "Role",
                newName: "roleName");

            migrationBuilder.RenameColumn(
                name: "role_id",
                table: "Role",
                newName: "roleID");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:pgcrypto", ",,");

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<long>(
                name: "usrID",
                table: "User",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "addressID",
                table: "User",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "avatarUrl",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "coverUrl",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "createAt",
                table: "User",
                type: "timestamp(0) without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateOnly>(
                name: "dob",
                table: "User",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "emailVerifyToken",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "forgotPasswordToken",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "fullname",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "skinCondID",
                table: "User",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "skinTypeID",
                table: "User",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updateAt",
                table: "User",
                type: "timestamp(0) without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "roleName",
                table: "Role",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<long>(
                name: "roleID",
                table: "Role",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldDefaultValueSql: "gen_random_uuid()");

            migrationBuilder.AddColumn<bool>(
                name: "roleStatus",
                table: "Role",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "User_pkey",
                table: "User",
                column: "usrID");

            migrationBuilder.AddPrimaryKey(
                name: "Role_pkey",
                table: "Role",
                column: "roleID");

            migrationBuilder.CreateTable(
                name: "AccountStatus",
                columns: table => new
                {
                    accStatusID = table.Column<long>(type: "bigint", nullable: false),
                    statusName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("AccountStatus_pkey", x => x.accStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Address",
                columns: table => new
                {
                    addressID = table.Column<long>(type: "bigint", nullable: false),
                    addDetail = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ward = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    district = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    city = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    country = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Address_pkey", x => x.addressID);
                });

            migrationBuilder.CreateTable(
                name: "Brand",
                columns: table => new
                {
                    brandID = table.Column<long>(type: "bigint", nullable: false),
                    brandName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    brandDesc = table.Column<string>(type: "text", nullable: true),
                    brandOrigin = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    brandStatus = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Brand_pkey", x => x.brandID);
                });

            migrationBuilder.CreateTable(
                name: "CategoryProduct",
                columns: table => new
                {
                    cateProdID = table.Column<long>(type: "bigint", nullable: false),
                    cateProdName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    cateProdStatus = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("CategoryProduct_pkey", x => x.cateProdID);
                });

            migrationBuilder.CreateTable(
                name: "DeliveryService",
                columns: table => new
                {
                    DeliServiceID = table.Column<long>(type: "bigint", nullable: false),
                    contactService = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    DeliServiceName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    deliServiceStatus = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("DeliveryService_pkey", x => x.DeliServiceID);
                });

            migrationBuilder.CreateTable(
                name: "Event",
                columns: table => new
                {
                    eventID = table.Column<long>(type: "bigint", nullable: false),
                    eventName = table.Column<long>(type: "bigint", nullable: false),
                    startTime = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    endTime = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    eventDesc = table.Column<string>(type: "text", nullable: true),
                    discountPercent = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Event_pkey", x => x.eventID);
                });

            migrationBuilder.CreateTable(
                name: "OrderStatus",
                columns: table => new
                {
                    ordStatusID = table.Column<long>(type: "bigint", nullable: false),
                    ordStatusName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("OrderStatus_pkey", x => x.ordStatusID);
                });

            migrationBuilder.CreateTable(
                name: "SkinCondition",
                columns: table => new
                {
                    SkinCondID = table.Column<long>(type: "bigint", nullable: false),
                    condition = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    conditionDesc = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("SkinCondition_pkey", x => x.SkinCondID);
                });

            migrationBuilder.CreateTable(
                name: "SkinType",
                columns: table => new
                {
                    skinTypeID = table.Column<long>(type: "bigint", nullable: false),
                    skinType = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    skinTypeDesc = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("SkinType_pkey", x => x.skinTypeID);
                });

            migrationBuilder.CreateTable(
                name: "SkinTypeTest",
                columns: table => new
                {
                    testID = table.Column<long>(type: "bigint", nullable: false),
                    createdByUsrID = table.Column<long>(type: "bigint", nullable: false),
                    testDesc = table.Column<long>(type: "bigint", nullable: false),
                    createAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("SkinTypeTest_pkey", x => x.testID);
                    table.ForeignKey(
                        name: "skintypetest_createdbyusrid_foreign",
                        column: x => x.createdByUsrID,
                        principalTable: "User",
                        principalColumn: "usrID");
                });

            migrationBuilder.CreateTable(
                name: "Voucher",
                columns: table => new
                {
                    voucherID = table.Column<long>(type: "bigint", nullable: false),
                    voucherDiscount = table.Column<double>(type: "double precision", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    voucherDesc = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Voucher_pkey", x => x.voucherID);
                    table.ForeignKey(
                        name: "voucher_usrid_foreign",
                        column: x => x.usrID,
                        principalTable: "User",
                        principalColumn: "usrID");
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    accID = table.Column<long>(type: "bigint", nullable: false),
                    roleID = table.Column<long>(type: "bigint", nullable: false),
                    accStatusID = table.Column<long>(type: "bigint", nullable: false),
                    username = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    password = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false, defaultValueSql: "'255'::character varying")
                },
                constraints: table =>
                {
                    table.PrimaryKey("Account_pkey", x => x.accID);
                    table.ForeignKey(
                        name: "account_accid_foreign",
                        column: x => x.accID,
                        principalTable: "User",
                        principalColumn: "usrID");
                    table.ForeignKey(
                        name: "account_accstatusid_foreign",
                        column: x => x.accStatusID,
                        principalTable: "AccountStatus",
                        principalColumn: "accStatusID");
                    table.ForeignKey(
                        name: "account_roleid_foreign",
                        column: x => x.roleID,
                        principalTable: "Role",
                        principalColumn: "roleID");
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    productID = table.Column<long>(type: "bigint", nullable: false),
                    cateID = table.Column<long>(type: "bigint", nullable: false),
                    brandID = table.Column<long>(type: "bigint", nullable: false),
                    skinTypeID = table.Column<long>(type: "bigint", nullable: false),
                    productName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    productDesc = table.Column<string>(type: "text", nullable: true),
                    productImgUrl = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true, defaultValueSql: "'Array'::character varying", comment: "Array Varchar"),
                    stocks = table.Column<int>(type: "integer", nullable: false),
                    costPrice = table.Column<double>(type: "double precision", nullable: false),
                    sellPrice = table.Column<double>(type: "double precision", nullable: false),
                    useFor = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true, comment: "Suitable for skin type..."),
                    totalRating = table.Column<double>(type: "double precision", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Product_pkey", x => x.productID);
                    table.ForeignKey(
                        name: "product_brandid_foreign",
                        column: x => x.brandID,
                        principalTable: "Brand",
                        principalColumn: "brandID");
                    table.ForeignKey(
                        name: "product_cateid_foreign",
                        column: x => x.cateID,
                        principalTable: "CategoryProduct",
                        principalColumn: "cateProdID");
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    ordID = table.Column<long>(type: "bigint", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    eventID = table.Column<long>(type: "bigint", nullable: false),
                    ordDate = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    ordStatusID = table.Column<long>(type: "bigint", nullable: false),
                    totalOrdPricr = table.Column<double>(type: "double precision", nullable: false),
                    createAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    updateAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Order_pkey", x => x.ordID);
                    table.ForeignKey(
                        name: "order_eventid_foreign",
                        column: x => x.eventID,
                        principalTable: "Event",
                        principalColumn: "eventID");
                    table.ForeignKey(
                        name: "order_ordstatusid_foreign",
                        column: x => x.ordStatusID,
                        principalTable: "OrderStatus",
                        principalColumn: "ordStatusID");
                });

            migrationBuilder.CreateTable(
                name: "Question",
                columns: table => new
                {
                    questionID = table.Column<long>(type: "bigint", nullable: false),
                    skinTypeID = table.Column<long>(type: "bigint", nullable: false),
                    questionContent = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Question_pkey", x => x.questionID);
                    table.ForeignKey(
                        name: "question_skintypeid_foreign",
                        column: x => x.skinTypeID,
                        principalTable: "SkinType",
                        principalColumn: "skinTypeID");
                });

            migrationBuilder.CreateTable(
                name: "ResultSkinTest",
                columns: table => new
                {
                    resultID = table.Column<long>(type: "bigint", nullable: false),
                    testID = table.Column<long>(type: "bigint", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    skinTypeID = table.Column<long>(type: "bigint", nullable: false),
                    createAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ResultSkinTest_pkey", x => x.resultID);
                    table.ForeignKey(
                        name: "resultskintest_skintypeid_foreign",
                        column: x => x.skinTypeID,
                        principalTable: "SkinType",
                        principalColumn: "skinTypeID");
                    table.ForeignKey(
                        name: "resultskintest_testid_foreign",
                        column: x => x.testID,
                        principalTable: "SkinTypeTest",
                        principalColumn: "testID");
                    table.ForeignKey(
                        name: "resultskintest_usrid_foreign",
                        column: x => x.usrID,
                        principalTable: "User",
                        principalColumn: "usrID");
                });

            migrationBuilder.CreateTable(
                name: "Comment",
                columns: table => new
                {
                    commentID = table.Column<long>(type: "bigint", nullable: false),
                    commentContent = table.Column<string>(type: "text", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    prodID = table.Column<long>(type: "bigint", nullable: false),
                    createAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    updateAd = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Comment_pkey", x => x.commentID);
                    table.ForeignKey(
                        name: "comment_prodid_foreign",
                        column: x => x.prodID,
                        principalTable: "Product",
                        principalColumn: "productID");
                    table.ForeignKey(
                        name: "comment_usrid_foreign",
                        column: x => x.usrID,
                        principalTable: "User",
                        principalColumn: "usrID");
                });

            migrationBuilder.CreateTable(
                name: "EventDetail",
                columns: table => new
                {
                    eventDetailID = table.Column<long>(type: "bigint", nullable: false),
                    productID = table.Column<long>(type: "bigint", nullable: false),
                    eventID = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("EventDetail_pkey", x => x.eventDetailID);
                    table.ForeignKey(
                        name: "eventdetail_eventid_foreign",
                        column: x => x.eventID,
                        principalTable: "Event",
                        principalColumn: "eventID");
                    table.ForeignKey(
                        name: "eventdetail_productid_foreign",
                        column: x => x.productID,
                        principalTable: "Product",
                        principalColumn: "productID");
                });

            migrationBuilder.CreateTable(
                name: "RatingProduct",
                columns: table => new
                {
                    ratingProdID = table.Column<long>(type: "bigint", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    prodID = table.Column<long>(type: "bigint", nullable: false),
                    rating = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("RatingProduct_pkey", x => x.ratingProdID);
                    table.ForeignKey(
                        name: "ratingproduct_prodid_foreign",
                        column: x => x.prodID,
                        principalTable: "Product",
                        principalColumn: "productID");
                    table.ForeignKey(
                        name: "ratingproduct_usrid_foreign",
                        column: x => x.usrID,
                        principalTable: "User",
                        principalColumn: "usrID");
                });

            migrationBuilder.CreateTable(
                name: "DeliveryDetail",
                columns: table => new
                {
                    deliID = table.Column<long>(type: "bigint", nullable: false),
                    deliServiceID = table.Column<long>(type: "bigint", nullable: false),
                    addressID = table.Column<long>(type: "bigint", nullable: false),
                    ordID = table.Column<long>(type: "bigint", nullable: false),
                    deliStatus = table.Column<bool>(type: "boolean", nullable: false, comment: "Just manage 2 status: Success / False"),
                    createAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("DeliveryDetail_pkey", x => x.deliID);
                    table.ForeignKey(
                        name: "deliverydetail_addressid_foreign",
                        column: x => x.addressID,
                        principalTable: "Address",
                        principalColumn: "addressID");
                    table.ForeignKey(
                        name: "deliverydetail_deliserviceid_foreign",
                        column: x => x.deliServiceID,
                        principalTable: "DeliveryService",
                        principalColumn: "DeliServiceID");
                    table.ForeignKey(
                        name: "deliverydetail_ordid_foreign",
                        column: x => x.ordID,
                        principalTable: "Order",
                        principalColumn: "ordID");
                });

            migrationBuilder.CreateTable(
                name: "OrderDetail",
                columns: table => new
                {
                    ordDetailID = table.Column<long>(type: "bigint", nullable: false),
                    ordID = table.Column<long>(type: "bigint", nullable: false),
                    prodID = table.Column<long>(type: "bigint", nullable: false),
                    quantity = table.Column<short>(type: "smallint", nullable: false),
                    sellPrice = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("OrderDetail_pkey", x => x.ordDetailID);
                    table.ForeignKey(
                        name: "orderdetail_ordid_foreign",
                        column: x => x.ordID,
                        principalTable: "Order",
                        principalColumn: "ordID");
                    table.ForeignKey(
                        name: "orderdetail_prodid_foreign",
                        column: x => x.prodID,
                        principalTable: "Product",
                        principalColumn: "productID");
                });

            migrationBuilder.CreateTable(
                name: "OrderLog",
                columns: table => new
                {
                    ordLogID = table.Column<long>(type: "bigint", nullable: false),
                    newStatusOrdID = table.Column<long>(type: "bigint", nullable: false),
                    ordID = table.Column<long>(type: "bigint", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    note = table.Column<string>(type: "text", nullable: true),
                    createAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("OrderLog_pkey", x => x.ordLogID);
                    table.ForeignKey(
                        name: "orderlog_newstatusordid_foreign",
                        column: x => x.newStatusOrdID,
                        principalTable: "OrderStatus",
                        principalColumn: "ordStatusID");
                    table.ForeignKey(
                        name: "orderlog_ordid_foreign",
                        column: x => x.ordID,
                        principalTable: "Order",
                        principalColumn: "ordID");
                    table.ForeignKey(
                        name: "orderlog_usrid_foreign",
                        column: x => x.usrID,
                        principalTable: "User",
                        principalColumn: "usrID");
                });

            migrationBuilder.CreateTable(
                name: "WarantyOrder",
                columns: table => new
                {
                    warantyID = table.Column<long>(type: "bigint", nullable: false),
                    ordID = table.Column<long>(type: "bigint", nullable: false),
                    createAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    endDate = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("WarantyOrder_pkey", x => x.warantyID);
                    table.ForeignKey(
                        name: "warantyorder_ordid_foreign",
                        column: x => x.ordID,
                        principalTable: "Order",
                        principalColumn: "ordID");
                });

            migrationBuilder.CreateTable(
                name: "SkinTypeTestDetail",
                columns: table => new
                {
                    detailID = table.Column<long>(type: "bigint", nullable: false),
                    testID = table.Column<long>(type: "bigint", nullable: false),
                    questionID = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("SkinTypeTestDetail_pkey", x => x.detailID);
                    table.ForeignKey(
                        name: "skintypetestdetail_questionid_foreign",
                        column: x => x.questionID,
                        principalTable: "Question",
                        principalColumn: "questionID");
                    table.ForeignKey(
                        name: "skintypetestdetail_testid_foreign",
                        column: x => x.testID,
                        principalTable: "SkinTypeTest",
                        principalColumn: "testID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_addressID",
                table: "User",
                column: "addressID");

            migrationBuilder.CreateIndex(
                name: "IX_User_skinCondID",
                table: "User",
                column: "skinCondID");

            migrationBuilder.CreateIndex(
                name: "IX_User_skinTypeID",
                table: "User",
                column: "skinTypeID");

            migrationBuilder.CreateIndex(
                name: "account_username_unique",
                table: "Account",
                column: "username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Account_accStatusID",
                table: "Account",
                column: "accStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Account_roleID",
                table: "Account",
                column: "roleID");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_prodID",
                table: "Comment",
                column: "prodID");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_usrID",
                table: "Comment",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryDetail_addressID",
                table: "DeliveryDetail",
                column: "addressID");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryDetail_deliServiceID",
                table: "DeliveryDetail",
                column: "deliServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryDetail_ordID",
                table: "DeliveryDetail",
                column: "ordID");

            migrationBuilder.CreateIndex(
                name: "IX_EventDetail_eventID",
                table: "EventDetail",
                column: "eventID");

            migrationBuilder.CreateIndex(
                name: "IX_EventDetail_productID",
                table: "EventDetail",
                column: "productID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_eventID",
                table: "Order",
                column: "eventID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_ordStatusID",
                table: "Order",
                column: "ordStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_ordID",
                table: "OrderDetail",
                column: "ordID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_prodID",
                table: "OrderDetail",
                column: "prodID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderLog_newStatusOrdID",
                table: "OrderLog",
                column: "newStatusOrdID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderLog_ordID",
                table: "OrderLog",
                column: "ordID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderLog_usrID",
                table: "OrderLog",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_brandID",
                table: "Product",
                column: "brandID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_cateID",
                table: "Product",
                column: "cateID");

            migrationBuilder.CreateIndex(
                name: "IX_Question_skinTypeID",
                table: "Question",
                column: "skinTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_RatingProduct_prodID",
                table: "RatingProduct",
                column: "prodID");

            migrationBuilder.CreateIndex(
                name: "IX_RatingProduct_usrID",
                table: "RatingProduct",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_ResultSkinTest_skinTypeID",
                table: "ResultSkinTest",
                column: "skinTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_ResultSkinTest_testID",
                table: "ResultSkinTest",
                column: "testID");

            migrationBuilder.CreateIndex(
                name: "IX_ResultSkinTest_usrID",
                table: "ResultSkinTest",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_SkinTypeTest_createdByUsrID",
                table: "SkinTypeTest",
                column: "createdByUsrID");

            migrationBuilder.CreateIndex(
                name: "IX_SkinTypeTestDetail_questionID",
                table: "SkinTypeTestDetail",
                column: "questionID");

            migrationBuilder.CreateIndex(
                name: "IX_SkinTypeTestDetail_testID",
                table: "SkinTypeTestDetail",
                column: "testID");

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_usrID",
                table: "Voucher",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_WarantyOrder_ordID",
                table: "WarantyOrder",
                column: "ordID");

            migrationBuilder.AddForeignKey(
                name: "user_addressid_foreign",
                table: "User",
                column: "addressID",
                principalTable: "Address",
                principalColumn: "addressID");

            migrationBuilder.AddForeignKey(
                name: "user_skincondid_foreign",
                table: "User",
                column: "skinCondID",
                principalTable: "SkinCondition",
                principalColumn: "SkinCondID");

            migrationBuilder.AddForeignKey(
                name: "user_skintypeid_foreign",
                table: "User",
                column: "skinTypeID",
                principalTable: "SkinType",
                principalColumn: "skinTypeID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "user_addressid_foreign",
                table: "User");

            migrationBuilder.DropForeignKey(
                name: "user_skincondid_foreign",
                table: "User");

            migrationBuilder.DropForeignKey(
                name: "user_skintypeid_foreign",
                table: "User");

            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "Comment");

            migrationBuilder.DropTable(
                name: "DeliveryDetail");

            migrationBuilder.DropTable(
                name: "EventDetail");

            migrationBuilder.DropTable(
                name: "OrderDetail");

            migrationBuilder.DropTable(
                name: "OrderLog");

            migrationBuilder.DropTable(
                name: "RatingProduct");

            migrationBuilder.DropTable(
                name: "ResultSkinTest");

            migrationBuilder.DropTable(
                name: "SkinCondition");

            migrationBuilder.DropTable(
                name: "SkinTypeTestDetail");

            migrationBuilder.DropTable(
                name: "Voucher");

            migrationBuilder.DropTable(
                name: "WarantyOrder");

            migrationBuilder.DropTable(
                name: "AccountStatus");

            migrationBuilder.DropTable(
                name: "Address");

            migrationBuilder.DropTable(
                name: "DeliveryService");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "Question");

            migrationBuilder.DropTable(
                name: "SkinTypeTest");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "Brand");

            migrationBuilder.DropTable(
                name: "CategoryProduct");

            migrationBuilder.DropTable(
                name: "SkinType");

            migrationBuilder.DropTable(
                name: "Event");

            migrationBuilder.DropTable(
                name: "OrderStatus");

            migrationBuilder.DropPrimaryKey(
                name: "User_pkey",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_addressID",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_skinCondID",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_skinTypeID",
                table: "User");

            migrationBuilder.DropPrimaryKey(
                name: "Role_pkey",
                table: "Role");

            migrationBuilder.DropColumn(
                name: "usrID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "addressID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "avatarUrl",
                table: "User");

            migrationBuilder.DropColumn(
                name: "coverUrl",
                table: "User");

            migrationBuilder.DropColumn(
                name: "createAt",
                table: "User");

            migrationBuilder.DropColumn(
                name: "dob",
                table: "User");

            migrationBuilder.DropColumn(
                name: "emailVerifyToken",
                table: "User");

            migrationBuilder.DropColumn(
                name: "forgotPasswordToken",
                table: "User");

            migrationBuilder.DropColumn(
                name: "fullname",
                table: "User");

            migrationBuilder.DropColumn(
                name: "skinCondID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "skinTypeID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "updateAt",
                table: "User");

            migrationBuilder.DropColumn(
                name: "roleStatus",
                table: "Role");

            migrationBuilder.RenameTable(
                name: "User",
                newName: "users");

            migrationBuilder.RenameTable(
                name: "Role",
                newName: "roles");

            migrationBuilder.RenameColumn(
                name: "roleName",
                table: "roles",
                newName: "role_name");

            migrationBuilder.RenameColumn(
                name: "roleID",
                table: "roles",
                newName: "role_id");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:pgcrypto", ",,");

            migrationBuilder.AlterColumn<string>(
                name: "email",
                table: "users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<Guid>(
                name: "user_id",
                table: "users",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()");

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "users",
                type: "timestamp without time zone",
                nullable: true,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddColumn<string>(
                name: "name",
                table: "users",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "role_name",
                table: "roles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<Guid>(
                name: "role_id",
                table: "roles",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "roles",
                type: "timestamp without time zone",
                nullable: true,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddPrimaryKey(
                name: "users_pkey",
                table: "users",
                column: "user_id");

            migrationBuilder.AddPrimaryKey(
                name: "roles_pkey",
                table: "roles",
                column: "role_id");

            migrationBuilder.CreateTable(
                name: "Job",
                columns: table => new
                {
                    JobId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Job_pkey", x => x.JobId);
                });

            migrationBuilder.CreateTable(
                name: "user_roles",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    role_id = table.Column<Guid>(type: "uuid", nullable: false),
                    assigned_at = table.Column<DateTime>(type: "timestamp without time zone", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("user_roles_pkey", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "user_roles_role_id_fkey",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "role_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "user_roles_user_id_fkey",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "users_email_key",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "roles_role_name_key",
                table: "roles",
                column: "role_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_roles_role_id",
                table: "user_roles",
                column: "role_id");
        }
    }
}
