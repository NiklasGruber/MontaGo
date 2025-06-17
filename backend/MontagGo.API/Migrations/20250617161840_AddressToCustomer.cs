using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MontagGo.API.Migrations
{
    /// <inheritdoc />
    public partial class AddressToCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Customers",
                newName: "PhoneNumber");

            migrationBuilder.AddColumn<int>(
                name: "AddressId",
                table: "Customers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ContactPerson",
                table: "Customers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Customers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_AddressId",
                table: "Customers",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Addresses_AddressId",
                table: "Customers",
                column: "AddressId",
                principalTable: "Addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Addresses_AddressId",
                table: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Customers_AddressId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "AddressId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "ContactPerson",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Customers");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Customers",
                newName: "Address");
        }
    }
}
