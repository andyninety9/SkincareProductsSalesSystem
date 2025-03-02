using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20250302232108 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<string>>(
                name: "voucherCode",
                table: "Voucher",
                type: "character varying(30)[]",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "character varying(10)[]");

            migrationBuilder.AddColumn<bool>(
                name: "statusEvent",
                table: "Voucher",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "statusEvent",
                table: "Voucher");

            migrationBuilder.AlterColumn<List<string>>(
                name: "voucherCode",
                table: "Voucher",
                type: "character varying(10)[]",
                nullable: false,
                oldClrType: typeof(List<string>),
                oldType: "character varying(30)[]");
        }
    }
}
