using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20250120140725 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "productimage_productid_foreign",
                table: "ProductImage");

            migrationBuilder.DropForeignKey(
                name: "returnproduct_ordid_foreign",
                table: "ReturnProduct");

            migrationBuilder.DropForeignKey(
                name: "returnproductdetail_prodid_foreign",
                table: "ReturnProductDetail");

            migrationBuilder.DropTable(
                name: "AnswerUser");

            migrationBuilder.DropTable(
                name: "ResultSkinTest");

            migrationBuilder.DropTable(
                name: "SkinTypeTestDetail");

            migrationBuilder.DropTable(
                name: "UseFor");

            migrationBuilder.DropTable(
                name: "SkinTypeTest");

            migrationBuilder.RenameColumn(
                name: "createAt",
                table: "WarantyOrder",
                newName: "createdAt");

            migrationBuilder.RenameColumn(
                name: "updateAt",
                table: "User",
                newName: "updatedAt");

            migrationBuilder.RenameColumn(
                name: "createAt",
                table: "User",
                newName: "createdAt");

            migrationBuilder.RenameColumn(
                name: "prodID",
                table: "ReturnProductDetail",
                newName: "prodIDre");

            migrationBuilder.RenameColumn(
                name: "returnProductDetailID",
                table: "ReturnProductDetail",
                newName: "returnProdDetailID");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnProductDetail_prodID",
                table: "ReturnProductDetail",
                newName: "IX_ReturnProductDetail_prodIDre");

            migrationBuilder.RenameColumn(
                name: "ordID",
                table: "ReturnProduct",
                newName: "ordIDd");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnProduct_ordID",
                table: "ReturnProduct",
                newName: "IX_ReturnProduct_ordIDd");

            migrationBuilder.RenameColumn(
                name: "productImageUrl",
                table: "ProductImage",
                newName: "prodImageUrl");

            migrationBuilder.RenameColumn(
                name: "productID",
                table: "ProductImage",
                newName: "prodID");

            migrationBuilder.RenameColumn(
                name: "productImageID",
                table: "ProductImage",
                newName: "prodImageID");

            migrationBuilder.RenameIndex(
                name: "IX_ProductImage_productID",
                table: "ProductImage",
                newName: "IX_ProductImage_prodID");

            migrationBuilder.RenameColumn(
                name: "deliPhoneNumber",
                table: "DeliveryDetail",
                newName: "deliPhone");

            migrationBuilder.AlterColumn<short>(
                name: "gender",
                table: "User",
                type: "smallint",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "forgotPasswordToken",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "emailVerifyToken",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddColumn<short>(
                name: "rewardPoint",
                table: "User",
                type: "smallint",
                nullable: false,
                defaultValueSql: "'0'::smallint",
                comment: "0-250: Bronze rank\n250-1500: Silver rank\nOver 1500: Gold rank");

            migrationBuilder.AddColumn<double>(
                name: "refundAmount",
                table: "ReturnProduct",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<bool>(
                name: "returnStatus",
                table: "ReturnProduct",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<short>(
                name: "cateID",
                table: "Product",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<string>(
                name: "ingredient",
                table: "Product",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "instruction",
                table: "Product",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<short>(
                name: "prodStatusID",
                table: "Product",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0);

            migrationBuilder.AddColumn<bool>(
                name: "statusEvent",
                table: "Event",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<short>(
                name: "cateProdID",
                table: "CategoryProduct",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<short>(
                name: "accStatusID",
                table: "AccountStatus",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.CreateTable(
                name: "ProductStatus",
                columns: table => new
                {
                    prodStatusID = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    prodStatusName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ProductStatus_pkey", x => x.prodStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Quiz",
                columns: table => new
                {
                    quizID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    quizName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    quizDesc = table.Column<string>(type: "text", nullable: false),
                    createdAt = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Quiz_pkey", x => x.quizID);
                });

            migrationBuilder.CreateTable(
                name: "RecommendFor",
                columns: table => new
                {
                    recForID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    prodID = table.Column<long>(type: "bigint", nullable: false),
                    skinTypeID = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("RecommendFor_pkey", x => x.recForID);
                    table.ForeignKey(
                        name: "recommendfor_prodid_foreign",
                        column: x => x.prodID,
                        principalTable: "Product",
                        principalColumn: "productID");
                    table.ForeignKey(
                        name: "recommendfor_skintypeid_foreign",
                        column: x => x.skinTypeID,
                        principalTable: "SkinType",
                        principalColumn: "skinTypeID");
                });

            migrationBuilder.CreateTable(
                name: "TreatmentSolution",
                columns: table => new
                {
                    solutionID = table.Column<short>(type: "smallint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    skinTypeID = table.Column<short>(type: "smallint", nullable: false),
                    solutionContent = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TreatmentSolution_pkey", x => x.solutionID);
                    table.ForeignKey(
                        name: "treatmentsolution_skintypeid_foreign",
                        column: x => x.skinTypeID,
                        principalTable: "SkinType",
                        principalColumn: "skinTypeID");
                });

            migrationBuilder.CreateTable(
                name: "QuizDetail",
                columns: table => new
                {
                    detailID = table.Column<long>(type: "bigint", nullable: false),
                    questID = table.Column<short>(type: "smallint", nullable: false),
                    quizID = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("QuizDetail_pkey", x => x.detailID);
                    table.ForeignKey(
                        name: "quizdetail_questid_foreign",
                        column: x => x.questID,
                        principalTable: "Question",
                        principalColumn: "questionID");
                    table.ForeignKey(
                        name: "quizdetail_quizid_foreign",
                        column: x => x.quizID,
                        principalTable: "Quiz",
                        principalColumn: "quizID");
                });

            migrationBuilder.CreateTable(
                name: "ResultQuiz",
                columns: table => new
                {
                    resultID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    quizID = table.Column<long>(type: "bigint", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    ODScore = table.Column<short>(type: "smallint", nullable: false, defaultValueSql: "'0'::smallint", comment: "OilyDryScore"),
                    SRScore = table.Column<short>(type: "smallint", nullable: false, defaultValueSql: "'0'::smallint", comment: "SensitiveResistantScore"),
                    PNPScore = table.Column<short>(type: "smallint", nullable: false, defaultValueSql: "'0'::smallint", comment: "PigmentedNonPigmentedScore"),
                    WTScore = table.Column<short>(type: "smallint", nullable: false, defaultValueSql: "'0'::smallint", comment: "WrinkledTightScore"),
                    skinTypeID = table.Column<short>(type: "smallint", nullable: false),
                    createAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    isDefault = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ResultQuiz_pkey", x => x.resultID);
                    table.ForeignKey(
                        name: "resultquiz_quizid_foreign",
                        column: x => x.quizID,
                        principalTable: "Quiz",
                        principalColumn: "quizID");
                    table.ForeignKey(
                        name: "resultquiz_skintypeid_foreign",
                        column: x => x.skinTypeID,
                        principalTable: "SkinType",
                        principalColumn: "skinTypeID");
                    table.ForeignKey(
                        name: "resultquiz_usrid_foreign",
                        column: x => x.usrID,
                        principalTable: "User",
                        principalColumn: "usrID");
                });

            migrationBuilder.CreateTable(
                name: "ResultDetail",
                columns: table => new
                {
                    resultDetailID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    resultID = table.Column<long>(type: "bigint", nullable: false),
                    keyID = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ResultDetail_pkey", x => x.resultDetailID);
                    table.ForeignKey(
                        name: "resultdetail_keyid_foreign",
                        column: x => x.keyID,
                        principalTable: "KeyQuestion",
                        principalColumn: "keyID");
                    table.ForeignKey(
                        name: "resultdetail_resultid_foreign",
                        column: x => x.resultID,
                        principalTable: "ResultQuiz",
                        principalColumn: "resultID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Product_prodStatusID",
                table: "Product",
                column: "prodStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_QuizDetail_questID",
                table: "QuizDetail",
                column: "questID");

            migrationBuilder.CreateIndex(
                name: "IX_QuizDetail_quizID",
                table: "QuizDetail",
                column: "quizID");

            migrationBuilder.CreateIndex(
                name: "IX_RecommendFor_prodID",
                table: "RecommendFor",
                column: "prodID");

            migrationBuilder.CreateIndex(
                name: "IX_RecommendFor_skinTypeID",
                table: "RecommendFor",
                column: "skinTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_ResultDetail_keyID",
                table: "ResultDetail",
                column: "keyID");

            migrationBuilder.CreateIndex(
                name: "IX_ResultDetail_resultID",
                table: "ResultDetail",
                column: "resultID");

            migrationBuilder.CreateIndex(
                name: "IX_ResultQuiz_quizID",
                table: "ResultQuiz",
                column: "quizID");

            migrationBuilder.CreateIndex(
                name: "IX_ResultQuiz_skinTypeID",
                table: "ResultQuiz",
                column: "skinTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_ResultQuiz_usrID",
                table: "ResultQuiz",
                column: "usrID");

            migrationBuilder.CreateIndex(
                name: "IX_TreatmentSolution_skinTypeID",
                table: "TreatmentSolution",
                column: "skinTypeID");

            migrationBuilder.AddForeignKey(
                name: "product_prodstatusid_foreign",
                table: "Product",
                column: "prodStatusID",
                principalTable: "ProductStatus",
                principalColumn: "prodStatusID");

            migrationBuilder.AddForeignKey(
                name: "productimage_prodid_foreign",
                table: "ProductImage",
                column: "prodID",
                principalTable: "Product",
                principalColumn: "productID");

            migrationBuilder.AddForeignKey(
                name: "returnproduct_ordidd_foreign",
                table: "ReturnProduct",
                column: "ordIDd",
                principalTable: "Order",
                principalColumn: "ordID");

            migrationBuilder.AddForeignKey(
                name: "returnproductdetail_prodidre_foreign",
                table: "ReturnProductDetail",
                column: "prodIDre",
                principalTable: "Product",
                principalColumn: "productID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "product_prodstatusid_foreign",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "productimage_prodid_foreign",
                table: "ProductImage");

            migrationBuilder.DropForeignKey(
                name: "returnproduct_ordidd_foreign",
                table: "ReturnProduct");

            migrationBuilder.DropForeignKey(
                name: "returnproductdetail_prodidre_foreign",
                table: "ReturnProductDetail");

            migrationBuilder.DropTable(
                name: "ProductStatus");

            migrationBuilder.DropTable(
                name: "QuizDetail");

            migrationBuilder.DropTable(
                name: "RecommendFor");

            migrationBuilder.DropTable(
                name: "ResultDetail");

            migrationBuilder.DropTable(
                name: "TreatmentSolution");

            migrationBuilder.DropTable(
                name: "ResultQuiz");

            migrationBuilder.DropTable(
                name: "Quiz");

            migrationBuilder.DropIndex(
                name: "IX_Product_prodStatusID",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "rewardPoint",
                table: "User");

            migrationBuilder.DropColumn(
                name: "refundAmount",
                table: "ReturnProduct");

            migrationBuilder.DropColumn(
                name: "returnStatus",
                table: "ReturnProduct");

            migrationBuilder.DropColumn(
                name: "ingredient",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "instruction",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "prodStatusID",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "statusEvent",
                table: "Event");

            migrationBuilder.RenameColumn(
                name: "createdAt",
                table: "WarantyOrder",
                newName: "createAt");

            migrationBuilder.RenameColumn(
                name: "updatedAt",
                table: "User",
                newName: "updateAt");

            migrationBuilder.RenameColumn(
                name: "createdAt",
                table: "User",
                newName: "createAt");

            migrationBuilder.RenameColumn(
                name: "prodIDre",
                table: "ReturnProductDetail",
                newName: "prodID");

            migrationBuilder.RenameColumn(
                name: "returnProdDetailID",
                table: "ReturnProductDetail",
                newName: "returnProductDetailID");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnProductDetail_prodIDre",
                table: "ReturnProductDetail",
                newName: "IX_ReturnProductDetail_prodID");

            migrationBuilder.RenameColumn(
                name: "ordIDd",
                table: "ReturnProduct",
                newName: "ordID");

            migrationBuilder.RenameIndex(
                name: "IX_ReturnProduct_ordIDd",
                table: "ReturnProduct",
                newName: "IX_ReturnProduct_ordID");

            migrationBuilder.RenameColumn(
                name: "prodImageUrl",
                table: "ProductImage",
                newName: "productImageUrl");

            migrationBuilder.RenameColumn(
                name: "prodID",
                table: "ProductImage",
                newName: "productID");

            migrationBuilder.RenameColumn(
                name: "prodImageID",
                table: "ProductImage",
                newName: "productImageID");

            migrationBuilder.RenameIndex(
                name: "IX_ProductImage_prodID",
                table: "ProductImage",
                newName: "IX_ProductImage_productID");

            migrationBuilder.RenameColumn(
                name: "deliPhone",
                table: "DeliveryDetail",
                newName: "deliPhoneNumber");

            migrationBuilder.AlterColumn<string>(
                name: "gender",
                table: "User",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(short),
                oldType: "smallint",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "forgotPasswordToken",
                table: "User",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "emailVerifyToken",
                table: "User",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "cateID",
                table: "Product",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<long>(
                name: "cateProdID",
                table: "CategoryProduct",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<short>(
                name: "accStatusID",
                table: "AccountStatus",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.CreateTable(
                name: "AnswerUser",
                columns: table => new
                {
                    andID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    keyID = table.Column<short>(type: "smallint", nullable: false),
                    questionID = table.Column<short>(type: "smallint", nullable: false)
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
                name: "SkinTypeTest",
                columns: table => new
                {
                    testID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    createdAt = table.Column<DateOnly>(type: "date", nullable: false),
                    createdByUsrID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    testDesc = table.Column<string>(type: "text", nullable: false),
                    testName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("SkinTypeTest_pkey", x => x.testID);
                });

            migrationBuilder.CreateTable(
                name: "UseFor",
                columns: table => new
                {
                    recID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    prodID = table.Column<long>(type: "bigint", nullable: false),
                    skinTypeID = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("UseFor_pkey", x => x.recID);
                    table.ForeignKey(
                        name: "usefor_prodid_foreign",
                        column: x => x.prodID,
                        principalTable: "Product",
                        principalColumn: "productID");
                    table.ForeignKey(
                        name: "usefor_skintypeid_foreign",
                        column: x => x.skinTypeID,
                        principalTable: "SkinType",
                        principalColumn: "skinTypeID");
                });

            migrationBuilder.CreateTable(
                name: "ResultSkinTest",
                columns: table => new
                {
                    resultID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    skinTypeID = table.Column<short>(type: "smallint", nullable: false),
                    testID = table.Column<long>(type: "bigint", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    createAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    isDefault = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    ODScore = table.Column<short>(type: "smallint", nullable: false, defaultValueSql: "'0'::smallint", comment: "OilyDryScore"),
                    PNPScore = table.Column<short>(type: "smallint", nullable: false, defaultValueSql: "'0'::smallint", comment: "PigmentedNonPigmentedScore"),
                    SRScore = table.Column<short>(type: "smallint", nullable: false, defaultValueSql: "'0'::smallint", comment: "SensitiveResistantScore"),
                    WTScore = table.Column<short>(type: "smallint", nullable: false, defaultValueSql: "'0'::smallint", comment: "WrinkledTightScore")
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
                name: "SkinTypeTestDetail",
                columns: table => new
                {
                    detailID = table.Column<long>(type: "bigint", nullable: false),
                    questionID = table.Column<short>(type: "smallint", nullable: false),
                    testID = table.Column<long>(type: "bigint", nullable: false)
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
                name: "IX_AnswerUser_keyID",
                table: "AnswerUser",
                column: "keyID");

            migrationBuilder.CreateIndex(
                name: "IX_AnswerUser_questionID",
                table: "AnswerUser",
                column: "questionID");

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
                name: "IX_SkinTypeTestDetail_questionID",
                table: "SkinTypeTestDetail",
                column: "questionID");

            migrationBuilder.CreateIndex(
                name: "IX_SkinTypeTestDetail_testID",
                table: "SkinTypeTestDetail",
                column: "testID");

            migrationBuilder.CreateIndex(
                name: "IX_UseFor_prodID",
                table: "UseFor",
                column: "prodID");

            migrationBuilder.CreateIndex(
                name: "IX_UseFor_skinTypeID",
                table: "UseFor",
                column: "skinTypeID");

            migrationBuilder.AddForeignKey(
                name: "productimage_productid_foreign",
                table: "ProductImage",
                column: "productID",
                principalTable: "Product",
                principalColumn: "productID");

            migrationBuilder.AddForeignKey(
                name: "returnproduct_ordid_foreign",
                table: "ReturnProduct",
                column: "ordID",
                principalTable: "Order",
                principalColumn: "ordID");

            migrationBuilder.AddForeignKey(
                name: "returnproductdetail_prodid_foreign",
                table: "ReturnProductDetail",
                column: "prodID",
                principalTable: "Product",
                principalColumn: "productID");
        }
    }
}
