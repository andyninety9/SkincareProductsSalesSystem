using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AutoMigration_20250114193747 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "skinTypeID",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "useFor",
                table: "Product");

            migrationBuilder.RenameColumn(
                name: "createAt",
                table: "OrderLog",
                newName: "createdAt");

            migrationBuilder.RenameColumn(
                name: "updateAt",
                table: "Order",
                newName: "updatedAt");

            migrationBuilder.RenameColumn(
                name: "totalOrdPricr",
                table: "Order",
                newName: "totalOrdPrice");

            migrationBuilder.RenameColumn(
                name: "createAt",
                table: "Order",
                newName: "createdAt");

            migrationBuilder.AlterColumn<short>(
                name: "roleID",
                table: "Role",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "usrID",
                table: "RatingProduct",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<double>(
                name: "rating",
                table: "RatingProduct",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<short>(
                name: "ordStatusID",
                table: "OrderStatus",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<short>(
                name: "newStatusOrdID",
                table: "OrderLog",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "ordLogID",
                table: "OrderLog",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "ordDetailID",
                table: "OrderDetail",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<short>(
                name: "ordStatusID",
                table: "Order",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "eventDetailID",
                table: "EventDetail",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "eventName",
                table: "Event",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "eventID",
                table: "Event",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "DeliServiceID",
                table: "DeliveryService",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "deliID",
                table: "DeliveryDetail",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "usrID",
                table: "Comment",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<short>(
                name: "accStatusID",
                table: "AccountStatus",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<short>(
                name: "roleID",
                table: "Account",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<short>(
                name: "accStatusID",
                table: "Account",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

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

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryDetail_addressID",
                table: "DeliveryDetail",
                column: "addressID");

            migrationBuilder.CreateIndex(
                name: "IX_UseFor_prodID",
                table: "UseFor",
                column: "prodID");

            migrationBuilder.CreateIndex(
                name: "IX_UseFor_skinTypeID",
                table: "UseFor",
                column: "skinTypeID");

            migrationBuilder.AddForeignKey(
                name: "deliverydetail_addressid_foreign",
                table: "DeliveryDetail",
                column: "addressID",
                principalTable: "Address",
                principalColumn: "addressID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "deliverydetail_addressid_foreign",
                table: "DeliveryDetail");

            migrationBuilder.DropTable(
                name: "UseFor");

            migrationBuilder.DropIndex(
                name: "IX_DeliveryDetail_addressID",
                table: "DeliveryDetail");

            migrationBuilder.RenameColumn(
                name: "createdAt",
                table: "OrderLog",
                newName: "createAt");

            migrationBuilder.RenameColumn(
                name: "updatedAt",
                table: "Order",
                newName: "updateAt");

            migrationBuilder.RenameColumn(
                name: "totalOrdPrice",
                table: "Order",
                newName: "totalOrdPricr");

            migrationBuilder.RenameColumn(
                name: "createdAt",
                table: "Order",
                newName: "createAt");

            migrationBuilder.AlterColumn<string>(
                name: "roleID",
                table: "Role",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<long>(
                name: "usrID",
                table: "RatingProduct",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<short>(
                name: "rating",
                table: "RatingProduct",
                type: "smallint",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AddColumn<short>(
                name: "skinTypeID",
                table: "Product",
                type: "smallint",
                nullable: false,
                defaultValue: (short)0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "useFor",
                table: "Product",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                comment: "Suitable for skin type...");

            migrationBuilder.AlterColumn<string>(
                name: "ordStatusID",
                table: "OrderStatus",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<string>(
                name: "newStatusOrdID",
                table: "OrderLog",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<long>(
                name: "ordLogID",
                table: "OrderLog",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "ordDetailID",
                table: "OrderDetail",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "ordStatusID",
                table: "Order",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<long>(
                name: "eventDetailID",
                table: "EventDetail",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "eventName",
                table: "Event",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<long>(
                name: "eventID",
                table: "Event",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "DeliServiceID",
                table: "DeliveryService",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "deliID",
                table: "DeliveryDetail",
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
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "accStatusID",
                table: "AccountStatus",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<string>(
                name: "roleID",
                table: "Account",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");

            migrationBuilder.AlterColumn<string>(
                name: "accStatusID",
                table: "Account",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(short),
                oldType: "smallint");
        }
    }
}
