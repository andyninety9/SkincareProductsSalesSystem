using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20250206165111 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comment");

            migrationBuilder.DropTable(
                name: "RatingProduct");

            migrationBuilder.RenameIndex(
                name: "user_phone_unique",
                table: "User",
                newName: "User_phone_key");

            migrationBuilder.RenameIndex(
                name: "user_forgotpasswordtoken_unique",
                table: "User",
                newName: "User_forgotPasswordToken_key");

            migrationBuilder.RenameIndex(
                name: "user_emailverifytoken_unique",
                table: "User",
                newName: "User_emailVerifyToken_key");

            migrationBuilder.RenameIndex(
                name: "user_email_unique",
                table: "User",
                newName: "User_email_key");

            migrationBuilder.RenameIndex(
                name: "account_username_unique",
                table: "Account",
                newName: "Account_username_key");

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

            migrationBuilder.CreateTable(
                name: "Review",
                columns: table => new
                {
                    reviewID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    reviewContent = table.Column<string>(type: "text", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false),
                    prodID = table.Column<long>(type: "bigint", nullable: false),
                    rating = table.Column<double>(type: "double precision", nullable: false),
                    createdAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Review_pkey", x => x.reviewID);
                    table.ForeignKey(
                        name: "comment_prodid_foreign",
                        column: x => x.prodID,
                        principalTable: "Product",
                        principalColumn: "productID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Review_prodID",
                table: "Review",
                column: "prodID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Review");

            migrationBuilder.RenameIndex(
                name: "User_phone_key",
                table: "User",
                newName: "user_phone_unique");

            migrationBuilder.RenameIndex(
                name: "User_forgotPasswordToken_key",
                table: "User",
                newName: "user_forgotpasswordtoken_unique");

            migrationBuilder.RenameIndex(
                name: "User_emailVerifyToken_key",
                table: "User",
                newName: "user_emailverifytoken_unique");

            migrationBuilder.RenameIndex(
                name: "User_email_key",
                table: "User",
                newName: "user_email_unique");

            migrationBuilder.RenameIndex(
                name: "Account_username_key",
                table: "Account",
                newName: "account_username_unique");

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

            migrationBuilder.CreateTable(
                name: "Comment",
                columns: table => new
                {
                    commentID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    prodID = table.Column<long>(type: "bigint", nullable: false),
                    commentContent = table.Column<string>(type: "text", nullable: false),
                    createdAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "timestamp(0) without time zone", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Comment_pkey", x => x.commentID);
                    table.ForeignKey(
                        name: "comment_prodid_foreign",
                        column: x => x.prodID,
                        principalTable: "Product",
                        principalColumn: "productID");
                });

            migrationBuilder.CreateTable(
                name: "RatingProduct",
                columns: table => new
                {
                    ratingProdID = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    prodID = table.Column<long>(type: "bigint", nullable: false),
                    rating = table.Column<double>(type: "double precision", nullable: false),
                    usrID = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("RatingProduct_pkey", x => x.ratingProdID);
                    table.ForeignKey(
                        name: "ratingproduct_prodid_foreign",
                        column: x => x.prodID,
                        principalTable: "Product",
                        principalColumn: "productID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comment_prodID",
                table: "Comment",
                column: "prodID");

            migrationBuilder.CreateIndex(
                name: "IX_RatingProduct_prodID",
                table: "RatingProduct",
                column: "prodID");
        }
    }
}
