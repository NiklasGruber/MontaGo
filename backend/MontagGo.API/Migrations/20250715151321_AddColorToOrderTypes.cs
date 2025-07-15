using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MontagGo.API.Migrations
{
    /// <inheritdoc />
    public partial class AddColorToOrderTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColorHex",
                table: "OrderTypes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColorHex",
                table: "OrderTypes");
        }
    }
}
