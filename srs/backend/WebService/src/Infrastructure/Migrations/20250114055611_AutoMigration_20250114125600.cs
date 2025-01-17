using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20250114125600 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "account_accid_foreign",
                table: "Account");

            migrationBuilder.DropForeignKey(
                name: "comment_usrid_foreign",
                table: "Comment");

            migrationBuilder.DropForeignKey(
                name: "deliverydetail_addressid_foreign",
                table: "DeliveryDetail");

            migrationBuilder.DropForeignKey(
                name: "orderlog_usrid_foreign",
                table: "OrderLog");

            migrationBuilder.DropForeignKey(
                name: "question_skintypeid_foreign",
                table: "Question");

            migrationBuilder.DropForeignKey(
                name: "ratingproduct_usrid_foreign",
                table: "RatingProduct");

            migrationBuilder.DropForeignKey(
                name: "skintypetest_createdbyusrid_foreign",
                table: "SkinTypeTest");

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
                name: "SkinCondition");

            migrationBuilder.DropIndex(
                name: "IX_User_addressID",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_skinCondID",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_User_skinTypeID",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_SkinTypeTest_createdByUsrID",
                table: "SkinTypeTest");

            migrationBuilder.DropIndex(
                name: "IX_RatingProduct_usrID",
                table: "RatingProduct");

            migrationBuilder.DropIndex(
                name: "IX_Question_skinTypeID",
                table: "Question");

            migrationBuilder.DropIndex(
                name: "IX_OrderLog_usrID",
                table: "OrderLog");

            migrationBuilder.DropIndex(
                name: "IX_DeliveryDetail_addressID",
                table: "DeliveryDetail");

            migrationBuilder.DropIndex(
                name: "IX_Comment_usrID",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "addressID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "skinCondID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "skinTypeID",
                table: "User");

            migrationBuilder.DropColumn(
                name: "createAt",
                table: "SkinTypeTest");

            migrationBuilder.DropColumn(
                name: "skinType",
                table: "SkinType");

            migrationBuilder.DropColumn(
                name: "productImgUrl",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "updateAd",
                table: "Comment");

            migrationBuilder.RenameColumn(
                name: "skinTypeID",
                table: "Question",
                newName: "ansID");

            migrationBuilder.RenameColumn(
                name: "createAt",
                table: "Comment",
                newName: "updatedAt");

            migrationBuilder.AlterColumn<long>(
                name: "warantyID",
                table: "WarantyOrder",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "voucherID",
                table: "Voucher",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "gender",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "phone",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<short>(
                name: "questionID",
                table: "SkinTypeTestDetail",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "testDesc",
                table: "SkinTypeTest",
                type: "text",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "createdByUsrID",
                table: "SkinTypeTest",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "testID",
                table: "SkinTypeTest",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<DateOnly>(
                name: "createdAt",
                table: "SkinTypeTest",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "testName",
                table: "SkinTypeTest",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "skinTypeDesc",
                table: "SkinType",
                type: "text",
                nullable: false,
                comment: "Mô tả chi tiết về loại da.",
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<short>(
                name: "skinTypeID",
                table: "SkinType",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "skinTypeCodes",
                table: "SkinType",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                comment: "Mã loại da (ví dụ: \"OSPT\", \"DRNW\").");

            migrationBuilder.AddColumn<string>(
                name: "skinTypeName",
                table: "SkinType",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                comment: "Tên loại da đầy đủ (ví dụ: \"Oily, Sensitive, Pigmented, Tight\").");

            migrationBuilder.AlterColumn<string>(
                name: "roleID",
                table: "Role",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<short>(
                name: "skinTypeID",
                table: "ResultSkinTest",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "resultID",
                table: "ResultSkinTest",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<short>(
                name: "ODScore",
                table: "ResultSkinTest",
                type: "smallint",
                nullable: false,
                defaultValueSql: "'0'::smallint",
                comment: "OilyDryScore");

            migrationBuilder.AddColumn<short>(
                name: "PNPScore",
                table: "ResultSkinTest",
                type: "smallint",
                nullable: false,
                defaultValueSql: "'0'::smallint",
                comment: "PigmentedNonPigmentedScore");

            migrationBuilder.AddColumn<short>(
                name: "SRScore",
                table: "ResultSkinTest",
                type: "smallint",
                nullable: false,
                defaultValueSql: "'0'::smallint",
                comment: "SensitiveResistantScore");

            migrationBuilder.AddColumn<short>(
                name: "WTScore",
                table: "ResultSkinTest",
                type: "smallint",
                nullable: false,
                defaultValueSql: "'0'::smallint",
                comment: "WrinkledTightScore");

            migrationBuilder.AddColumn<bool>(
                name: "isDefault",
                table: "ResultSkinTest",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AlterColumn<long>(
                name: "usrID",
                table: "RatingProduct",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "ratingProdID",
                table: "RatingProduct",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<short>(
                name: "questionID",
                table: "Question",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "ansID",
                table: "Question",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<short>(
                name: "cateQuestionID",
                table: "Question",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<DateOnly>(
                name: "createdAt",
                table: "Question",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AlterColumn<int>(
                name: "stocks",
                table: "Product",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<short>(
                name: "skinTypeID",
                table: "Product",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<double>(
                name: "sellPrice",
                table: "Product",
                type: "double precision",
                nullable: false,
                defaultValueSql: "'0'::double precision",
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<double>(
                name: "costPrice",
                table: "Product",
                type: "double precision",
                nullable: false,
                defaultValueSql: "'0'::double precision",
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<long>(
                name: "productID",
                table: "Product",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "ordStatusID",
                table: "OrderStatus",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "newStatusOrdID",
                table: "OrderLog",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "ordStatusID",
                table: "Order",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "ordID",
                table: "Order",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "deliPhoneNumber",
                table: "DeliveryDetail",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<long>(
                name: "usrID",
                table: "Comment",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "commentID",
                table: "Comment",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<DateTime>(
                name: "createdAt",
                table: "Comment",
                type: "timestamp(0) without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<long>(
                name: "cateProdID",
                table: "CategoryProduct",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "brandID",
                table: "Brand",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "addressID",
                table: "Address",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<bool>(
                name: "isDefault",
                table: "Address",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<long>(
                name: "usrID",
                table: "Address",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<string>(
                name: "accStatusID",
                table: "AccountStatus",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "roleID",
                table: "Account",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<string>(
                name: "accStatusID",
                table: "Account",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "accID",
                table: "Account",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.CreateTable(
                name: "CategoryQuestion",
                columns: table => new
                {
                    cateQuestionID = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cateName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    cateDesc = table.Column<string>(type: "text", nullable: false),
                    createdAt = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("CategoryQuestion_pkey", x => x.cateQuestionID);
                });

            migrationBuilder.CreateTable(
                name: "KeyQuestion",
                columns: table => new
                {
                    keyID = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    questionID = table.Column<short>(type: "smallint", nullable: false),
                    keyContent = table.Column<string>(type: "text", nullable: false),
                    keyScore = table.Column<short>(type: "smallint", nullable: false),
                    createdAt = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("KeyQuestion_pkey", x => x.keyID);
                    table.ForeignKey(
                        name: "keyquestion_questionid_foreign",
                        column: x => x.questionID,
                        principalTable: "Question",
                        principalColumn: "questionID");
                });

            migrationBuilder.CreateTable(
                name: "ProductImage",
                columns: table => new
                {
                    productImageID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    productID = table.Column<long>(type: "bigint", nullable: false),
                    productImageUrl = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ProductImage_pkey", x => x.productImageID);
                    table.ForeignKey(
                        name: "productimage_productid_foreign",
                        column: x => x.productID,
                        principalTable: "Product",
                        principalColumn: "productID");
                });

            migrationBuilder.CreateTable(
                name: "ReturnProduct",
                columns: table => new
                {
                    returnID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ordID = table.Column<long>(type: "bigint", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    returnDate = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ReturnProduct_pkey", x => x.returnID);
                    table.ForeignKey(
                        name: "returnproduct_ordid_foreign",
                        column: x => x.ordID,
                        principalTable: "Order",
                        principalColumn: "ordID");
                    table.ForeignKey(
                        name: "returnproduct_usrid_foreign",
                        column: x => x.usrID,
                        principalTable: "User",
                        principalColumn: "usrID");
                });

            migrationBuilder.CreateTable(
                name: "AnswerUser",
                columns: table => new
                {
                    andID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    questionID = table.Column<short>(type: "smallint", nullable: false),
                    keyID = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("AnswerUser_pkey", x => x.andID);
                    table.ForeignKey(
                        name: "answeruser_keyid_foreign",
                        column: x => x.keyID,
                        principalTable: "KeyQuestion",
                        principalColumn: "keyID");
                    table.ForeignKey(
                        name: "answeruser_questionid_foreign",
                        column: x => x.questionID,
                        principalTable: "Question",
                        principalColumn: "questionID");
                });

            migrationBuilder.CreateTable(
                name: "ReturnProductDetail",
                columns: table => new
                {
                    returnProductDetailID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    prodID = table.Column<long>(type: "bigint", nullable: false),
                    returnID = table.Column<long>(type: "bigint", nullable: false),
                    returnImgUrl = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    returnQuantity = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ReturnProductDetail_pkey", x => x.returnProductDetailID);
                    table.ForeignKey(
                        name: "returnproductdetail_prodid_foreign",
                        column: x => x.prodID,
                        principalTable: "Product",
                        principalColumn: "productID");
                    table.ForeignKey(
                        name: "returnproductdetail_returnid_foreign",
                        column: x => x.returnID,
                        principalTable: "ReturnProduct",
                        principalColumn: "returnID");
                });

            migrationBuilder.CreateIndex(
                name: "user_email_unique",
                table: "User",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "user_emailverifytoken_unique",
                table: "User",
                column: "emailVerifyToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "user_forgotpasswordtoken_unique",
                table: "User",
                column: "forgotPasswordToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "user_phone_unique",
                table: "User",
                column: "phone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Question_cateQuestionID",
                table: "Question",
                column: "cateQuestionID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_usrID",
                table: "Order",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_Address_usrID",
                table: "Address",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_AnswerUser_keyID",
                table: "AnswerUser",
                column: "keyID");

            migrationBuilder.CreateIndex(
                name: "IX_AnswerUser_questionID",
                table: "AnswerUser",
                column: "questionID");

            migrationBuilder.CreateIndex(
                name: "IX_KeyQuestion_questionID",
                table: "KeyQuestion",
                column: "questionID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductImage_productID",
                table: "ProductImage",
                column: "productID");

            migrationBuilder.CreateIndex(
                name: "IX_ReturnProduct_ordID",
                table: "ReturnProduct",
                column: "ordID");

            migrationBuilder.CreateIndex(
                name: "IX_ReturnProduct_usrID",
                table: "ReturnProduct",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_ReturnProductDetail_prodID",
                table: "ReturnProductDetail",
                column: "prodID");

            migrationBuilder.CreateIndex(
                name: "IX_ReturnProductDetail_returnID",
                table: "ReturnProductDetail",
                column: "returnID");

            migrationBuilder.AddForeignKey(
                name: "address_usrid_foreign",
                table: "Address",
                column: "usrID",
                principalTable: "User",
                principalColumn: "usrID");

            migrationBuilder.AddForeignKey(
                name: "order_usrid_foreign",
                table: "Order",
                column: "usrID",
                principalTable: "User",
                principalColumn: "usrID");

            migrationBuilder.AddForeignKey(
                name: "question_catequestionid_foreign",
                table: "Question",
                column: "cateQuestionID",
                principalTable: "CategoryQuestion",
                principalColumn: "cateQuestionID");

            migrationBuilder.AddForeignKey(
                name: "user_usrid_foreign",
                table: "User",
                column: "usrID",
                principalTable: "Account",
                principalColumn: "accID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "address_usrid_foreign",
                table: "Address");

            migrationBuilder.DropForeignKey(
                name: "order_usrid_foreign",
                table: "Order");

            migrationBuilder.DropForeignKey(
                name: "question_catequestionid_foreign",
                table: "Question");

            migrationBuilder.DropForeignKey(
                name: "user_usrid_foreign",
                table: "User");

            migrationBuilder.DropTable(
                name: "AnswerUser");

            migrationBuilder.DropTable(
                name: "CategoryQuestion");

            migrationBuilder.DropTable(
                name: "ProductImage");

            migrationBuilder.DropTable(
                name: "ReturnProductDetail");

            migrationBuilder.DropTable(
                name: "KeyQuestion");

            migrationBuilder.DropTable(
                name: "ReturnProduct");

            migrationBuilder.DropIndex(
                name: "user_email_unique",
                table: "User");

            migrationBuilder.DropIndex(
                name: "user_emailverifytoken_unique",
                table: "User");

            migrationBuilder.DropIndex(
                name: "user_forgotpasswordtoken_unique",
                table: "User");

            migrationBuilder.DropIndex(
                name: "user_phone_unique",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_Question_cateQuestionID",
                table: "Question");

            migrationBuilder.DropIndex(
                name: "IX_Order_usrID",
                table: "Order");

            migrationBuilder.DropIndex(
                name: "IX_Address_usrID",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "gender",
                table: "User");

            migrationBuilder.DropColumn(
                name: "phone",
                table: "User");

            migrationBuilder.DropColumn(
                name: "createdAt",
                table: "SkinTypeTest");

            migrationBuilder.DropColumn(
                name: "testName",
                table: "SkinTypeTest");

            migrationBuilder.DropColumn(
                name: "skinTypeCodes",
                table: "SkinType");

            migrationBuilder.DropColumn(
                name: "skinTypeName",
                table: "SkinType");

            migrationBuilder.DropColumn(
                name: "ODScore",
                table: "ResultSkinTest");

            migrationBuilder.DropColumn(
                name: "PNPScore",
                table: "ResultSkinTest");

            migrationBuilder.DropColumn(
                name: "SRScore",
                table: "ResultSkinTest");

            migrationBuilder.DropColumn(
                name: "WTScore",
                table: "ResultSkinTest");

            migrationBuilder.DropColumn(
                name: "isDefault",
                table: "ResultSkinTest");

            migrationBuilder.DropColumn(
                name: "cateQuestionID",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "createdAt",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "deliPhoneNumber",
                table: "DeliveryDetail");

            migrationBuilder.DropColumn(
                name: "createdAt",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "isDefault",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "usrID",
                table: "Address");

            migrationBuilder.RenameColumn(
                name: "ansID",
                table: "Question",
                newName: "skinTypeID");

            migrationBuilder.RenameColumn(
                name: "updatedAt",
                table: "Comment",
                newName: "createAt");

            migrationBuilder.AlterColumn<long>(
                name: "warantyID",
                table: "WarantyOrder",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "voucherID",
                table: "Voucher",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<long>(
                name: "addressID",
                table: "User",
                type: "bigint",
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

            migrationBuilder.AlterColumn<long>(
                name: "questionID",
                table: "SkinTypeTestDetail",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<long>(
                name: "testDesc",
                table: "SkinTypeTest",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<long>(
                name: "createdByUsrID",
                table: "SkinTypeTest",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "testID",
                table: "SkinTypeTest",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<DateTime>(
                name: "createAt",
                table: "SkinTypeTest",
                type: "timestamp(0) without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "skinTypeDesc",
                table: "SkinType",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldComment: "Mô tả chi tiết về loại da.");

            migrationBuilder.AlterColumn<long>(
                name: "skinTypeID",
                table: "SkinType",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "skinType",
                table: "SkinType",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<long>(
                name: "roleID",
                table: "Role",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "skinTypeID",
                table: "ResultSkinTest",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<long>(
                name: "resultID",
                table: "ResultSkinTest",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "usrID",
                table: "RatingProduct",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "ratingProdID",
                table: "RatingProduct",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "questionID",
                table: "Question",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "skinTypeID",
                table: "Question",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<int>(
                name: "stocks",
                table: "Product",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValue: 0);

            migrationBuilder.AlterColumn<long>(
                name: "skinTypeID",
                table: "Product",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<double>(
                name: "sellPrice",
                table: "Product",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldDefaultValueSql: "'0'::double precision");

            migrationBuilder.AlterColumn<double>(
                name: "costPrice",
                table: "Product",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldDefaultValueSql: "'0'::double precision");

            migrationBuilder.AlterColumn<long>(
                name: "productID",
                table: "Product",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "productImgUrl",
                table: "Product",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                defaultValueSql: "'Array'::character varying",
                comment: "Array Varchar");

            migrationBuilder.AlterColumn<long>(
                name: "ordStatusID",
                table: "OrderStatus",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "newStatusOrdID",
                table: "OrderLog",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "ordStatusID",
                table: "Order",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "ordID",
                table: "Order",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "usrID",
                table: "Comment",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "commentID",
                table: "Comment",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<long>(
                name: "updateAd",
                table: "Comment",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<long>(
                name: "cateProdID",
                table: "CategoryProduct",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "brandID",
                table: "Brand",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "addressID",
                table: "Address",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "accStatusID",
                table: "AccountStatus",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "roleID",
                table: "Account",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "accStatusID",
                table: "Account",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "accID",
                table: "Account",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

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
                name: "IX_SkinTypeTest_createdByUsrID",
                table: "SkinTypeTest",
                column: "createdByUsrID");

            migrationBuilder.CreateIndex(
                name: "IX_RatingProduct_usrID",
                table: "RatingProduct",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_Question_skinTypeID",
                table: "Question",
                column: "skinTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderLog_usrID",
                table: "OrderLog",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryDetail_addressID",
                table: "DeliveryDetail",
                column: "addressID");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_usrID",
                table: "Comment",
                column: "usrID");

            migrationBuilder.AddForeignKey(
                name: "account_accid_foreign",
                table: "Account",
                column: "accID",
                principalTable: "User",
                principalColumn: "usrID");

            migrationBuilder.AddForeignKey(
                name: "comment_usrid_foreign",
                table: "Comment",
                column: "usrID",
                principalTable: "User",
                principalColumn: "usrID");

            migrationBuilder.AddForeignKey(
                name: "deliverydetail_addressid_foreign",
                table: "DeliveryDetail",
                column: "addressID",
                principalTable: "Address",
                principalColumn: "addressID");

            migrationBuilder.AddForeignKey(
                name: "orderlog_usrid_foreign",
                table: "OrderLog",
                column: "usrID",
                principalTable: "User",
                principalColumn: "usrID");

            migrationBuilder.AddForeignKey(
                name: "question_skintypeid_foreign",
                table: "Question",
                column: "skinTypeID",
                principalTable: "SkinType",
                principalColumn: "skinTypeID");

            migrationBuilder.AddForeignKey(
                name: "ratingproduct_usrid_foreign",
                table: "RatingProduct",
                column: "usrID",
                principalTable: "User",
                principalColumn: "usrID");

            migrationBuilder.AddForeignKey(
                name: "skintypetest_createdbyusrid_foreign",
                table: "SkinTypeTest",
                column: "createdByUsrID",
                principalTable: "User",
                principalColumn: "usrID");

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
    }
}
