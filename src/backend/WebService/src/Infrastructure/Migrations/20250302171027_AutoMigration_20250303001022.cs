using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20250303001022 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "voucherCode",
                table: "Voucher",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "character varying[]");

            migrationBuilder.AlterColumn<long>(
                name: "voucherID",
                table: "Voucher",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<string>>(
                name: "voucherCode",
                table: "Voucher",
                type: "character varying[]",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "voucherID",
                table: "Voucher",
                type: "character varying",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");
        }
    }
}
