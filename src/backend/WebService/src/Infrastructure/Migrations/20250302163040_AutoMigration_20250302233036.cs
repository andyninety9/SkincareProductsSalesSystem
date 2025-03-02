using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20250302233036 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "statusEvent",
                table: "Voucher",
                newName: "statusVoucher");

            migrationBuilder.AlterColumn<List<string>>(
                name: "voucherCode",
                table: "Voucher",
                type: "character varying[]",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "character varying(30)[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "statusVoucher",
                table: "Voucher",
                newName: "statusEvent");

            migrationBuilder.AlterColumn<List<string>>(
                name: "voucherCode",
                table: "Voucher",
                type: "character varying(30)[]",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "character varying[]");
        }
    }
}
