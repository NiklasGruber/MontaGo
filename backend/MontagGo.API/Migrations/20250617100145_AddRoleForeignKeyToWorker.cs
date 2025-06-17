using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MontagGo.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleForeignKeyToWorker : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Workers");

            migrationBuilder.AddColumn<int>(
                name: "RoleId",
                table: "Workers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Workers_RoleId",
                table: "Workers",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workers_Roles_RoleId",
                table: "Workers",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workers_Roles_RoleId",
                table: "Workers");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Workers_RoleId",
                table: "Workers");

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "Workers");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Workers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
